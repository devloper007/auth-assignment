import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler, successHandler } from "../utils/handler.js";
import database from "../db/connection.js";


function generateToken(userId,email) {
    // console.log("process.env.JWT_SECRET",process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    return jwt.sign({ id: userId, email: email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export const signUp = async (req, res) => {
    let {email, password } = req.body;
    
    try {
      if(!email || !password){
        return await next(errorHandler(res, "Please Fill All The Details", 422)); 
      }
      const userEmail = await email.trim();
      const user_query = `select * from users where email = ?`;
      const user = await database(user_query, [userEmail]);
      console.log("user", user);
      if(user.length > 0) return await errorHandler(res, "Email already exists", 422);
      const hashedPassword = bcrypt.hashSync(password, 10);

      console.log("hashedPassword", hashedPassword);
      const insert_user_query = `insert into users (email, password) values (?)`;
      const val = [[userEmail, hashedPassword]];
      const result = await database(insert_user_query, val);
      console.log("result", result);
      const token =  generateToken(result.insertId, userEmail);
      console.log("token", token);
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
      console.log("user", user);
      if(user.length <= 0) return await errorHandler(res, "Email not found", 404);
      const isMatch = bcrypt.compareSync(password, user[0].password);
      if(!isMatch) return await errorHandler(res, "Wrong Password", 401);
      const token =  generateToken(user[0].id, user[0].email, user[0].role);
      console.log("token", token);
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
  
      if(!data.email){
        return await errorHandler(res, "Something Went Wrong", 422);
      } 
    const userEmail = await data.email.trim();
    const user_query = `select * from users where email = ?`;
    const user = await database(user_query, [userEmail]);
    console.log("user", user);
    if(user.length <= 0) return await errorHandler(res, "Email not found", 404);
    const token =  generateToken(user[0].id, user[0].email, user[0].role);
    console.log("token", token);
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
        console.log("verifyEmail", verifyEmail);
        req.userId = verifyEmail.id;
        next();
      }
    } catch (error) {
      console.log(error);
      return await errorHandler(res, "Un-Authorize User", 401);
    }
  };

  export const adminAuth = async (req, res, next) => {
    try {
      const token = req.headers["authorization"].split("Bearer ")[1];
      if (!token) {
        return await errorHandler(res, "Un-Authorize User", 401);
      } else {
        const verifyEmail = jwt.verify(token, process.env.JWT_SECRET);
        console.log("verifyEmail", verifyEmail);
        if (verifyEmail.role !== "admin") {
          return await errorHandler(res, "Only Admin Can Access", 401);
        } else {
          req.userId = verifyEmail.id;
          next();
        }
      }
    } catch (error) {
      console.log(error);
      return await errorHandler(res, "Internal Server Error", 500);
    }
  }