import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler, successHandler } from "../utils/handler.js";
import database from "../db/connection.js";
// import unirest from "unirest";
import axios from "axios";
import { validator } from "../utils/validator.js";


function generateToken(userId,email) {
    return jwt.sign({ id: userId, email: email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export const signUp = async (req, res) => {
    let {email, password } = req.body;
    
    try {
      if(!email || !password){
        return await next(errorHandler(res, "Please Fill All The Details", 422)); 
      }

      const userEmail = await email.trim();
      const validateEmail = validator("email", userEmail);
      if(!validateEmail) return await errorHandler(res, "Invalid Email Format", 422);
      const validatePassword = validator("password", password);
      if(!validatePassword) return await errorHandler(res, "Invalid Password Format", 422);
      const user_query = `select * from users where email = ?`;
      const user = await database(user_query, [userEmail]);
      if(user.length > 0) return await errorHandler(res, "Email already exists", 422);
      const hashedPassword = bcrypt.hashSync(password, 10);
      const insert_user_query = `insert into users (email, password) values (?)`;
      const val = [[userEmail, hashedPassword]];
      const result = await database(insert_user_query, val);
      const token =  generateToken(result.insertId, userEmail);
      return await successHandler(res, {msg: "User Created Successfully",  token: token}, 201);
    } catch (error) {
      console.log("error", error);
       return await errorHandler(res, "Internal Server Error", 500);
    }
  };

 export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      if(!email || !password){
        return await next(errorHandler(res, "Please Fill All The Details", 422)); 
      }
      const userEmail = await email.trim();
      const user_query = `select * from users where email = ?`;
      const user = await database(user_query, [userEmail]);
      if(user.length <= 0) return await errorHandler(res, "Email not found", 404);
      const isMatch = bcrypt.compareSync(password, user[0].password);
      if(!isMatch) return await errorHandler(res, "Wrong Password", 401);
      const token =  generateToken(user[0].id, user[0].email, user[0].role);
      const resultUser ={
        id: user[0].id,
        name: user[0]?.name,
        email: user[0].email,
        bio: user[0]?.bio,
        phone: user[0]?.phone,
        photo: user[0]?.photo,
        role: user[0]?.role
      }
      return await successHandler(res, {user: resultUser,  token: token}, 200);
  }catch (error) {
    console.log("error", error);
     return await errorHandler(res, "Internal Server Error", 500);
  }
}

export const loginWithGoogle = async (req, res) => {
    try {
      const { data } = req.body;
  
      if(!data.email || !data.name){
        return await errorHandler(res, "Something Went Wrong", 422);
      } 
    const userEmail = await data.email.trim();
    const name_split = await data.name.split(" ");
    let name = "";
    if (name_split.length === 3) {
        name = name_split[0] + " " + name_split[1] + " " + name_split[2];
    } else if (name_split.length === 2) {
        name = name_split[0] + " " + name_split[1];
    } else {
      name = data.name;
    }
    const user_query = `select * from users where email = ?`;
    const user = await database(user_query, [userEmail]);
    if(user.length <= 0){
      const insert_user_query = `insert into users (email, name, role) values (?)`;
      const val = [[userEmail, name, "user"]];
      const result = await database(insert_user_query, val);
    }
    const token =  generateToken(user[0].id, user[0].email, user[0].role);
    const resultUser ={
      id: user[0].id,
      name: user[0]?.name,
      email: user[0].email,
      bio: user[0]?.bio,
      phone: user[0]?.phone,
      photo: user[0]?.photo,
      role: user[0]?.role
    }
    return await successHandler(res, {user: resultUser,  token: token}, 200);  
    } catch (error) {
      console.log(error);
      await errorHandler(res, "Internal Server Error", 500);
    }
  };

  export const verifyToken = async (req, res, next) => {
    try {
      const token = req.headers["authorization"].split("Bearer ")[1];
      
      if (!token) {
        return await errorHandler(res, "Un-Authorize User", 401);
      } else {
        const verifyEmail = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyEmail.id;
        next();
      }
    } catch (error) {
      console.log(error);
      return await errorHandler(res, "Un-Authorize User", 401);
    }
  };

  export const verifyRole = (role) => {
    return async (req, res, next) => {
    try {
        const user_id = req.userId;
        const user = await database('select role from users where id = ?', [user_id]);
        if (user[0].role !== role) {
          return await errorHandler(res, `Only '${role}' can access`, 401);
        } else {
          next();
        }
      } catch (error) {
      console.log(error);
      return await errorHandler(res, "Internal Server Error", 500);
    }
  }
}

  export const sendOTP = async (req, res) => {
    try {
        const {phone} = req.body;
        console.log("req.body 144");
        const otp_query = 'select * from user_otp where user_id = ?';
        const otp_result = await database(otp_query, [req.userId]);
        if(otp_result.length > 0){
            const delete_otp_query = 'delete from user_otp where user_id = ?';
            await database(delete_otp_query, [req.userId]);
        } 
        
        const otp =  generateOTP();
        const currentDate =  new Date( Date.now() + 10 * 60 * 1000);
        const expires_at = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        console.log("otp", otp, 'expires_at', expires_at);

        axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.SMS_AUTH_KEY}&variables_values=${otp}&route=otp&numbers=${phone}`).then(async (response) => {
            console.log("response 150", response.data);
            const otp_save_query = 'insert into user_otp (user_id, otp, expires_at) values (?)';
            const val  = [req.userId, otp, expires_at];
            const save_otp = await database(otp_save_query, [val]);
            return await successHandler(res, response.data, 200);
        }).catch(async(error) => {
            console.log('error 155', error.response?.data?.message);
            return await errorHandler(res, error.response?.data?.message, error.response?.data?.status_code);
        });
  }catch{
    return await errorHandler(res, "Internal Server Error", 500);
  }
  }

  export const verifyOTP = async (req, res) => {
    try {
        const {otp} = req.body;
        const otp_query = 'select * from user_otp where user_id = ?';
        const otp_result = await database(otp_query, [req.userId]);
        if(otp_result.length > 0){
            if(otp_result[0].otp === otp){
                // const delete_otp_query = 'delete from user_otp where user_id = ?';
                // await database(delete_otp_query, [req.userId]);
                return await successHandler(res, "OTP Verified Successfully", 200);
            }else{
                return await errorHandler(res, "Invalid OTP", 401);
            }
        }else{
            return await errorHandler(res, "OTP Not Found! Please Send OTP Again", 401);
        }
  }catch{
    return await errorHandler(res, "Internal Server Error", 500);
  }
  }

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }