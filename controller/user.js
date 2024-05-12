import database from "../db/connection.js";
import { errorHandler,successHandler } from "../utils/handler.js";
// import bcrypt from "bcryptjs";
import { uploadProfilePicture } from "../utils/multer.js";
import fs from "fs";
import { validator } from "../utils/validator.js";


export const userProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user_query = 'select name,email,bio,photo,phone,profile_visibility from users where id = ?';
        const user = await database(user_query, [userId]);
        return await successHandler(res, user, 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const editUser = async (req, res) => {
    try {
        console.log("req.body");
        const {name, bio, phone,email, profile_visibility} = req.body;
        if(!name || !email || !profile_visibility) return await errorHandler(res, "Required information missing(name/email/profile_visibility)", 422);
        if(!validator(email)) return await errorHandler(res, "Invalid Email Format", 422);
        if(!validator(phone)) return await errorHandler(res, "Invalid Phone Format", 422);
        const userId = req.userId;
        const user_update_query = 'update users set name = ?, bio = ?, phone = ? email = ?, profile_visibility = ? where id = ?';
        const val = [name, bio, phone, email, profile_visibility,userId];
        await database(user_update_query, val);
        return await successHandler(res, "User Updated Successfully", 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const getPublicUser = async (req, res) => {
    try {
        const public_user_query = 'select id,name,bio,photo from users where profile_visibility = "public"';
        const result = await database(public_user_query);
        return await successHandler(res, result, 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const getAllUser = async (req, res) => {
    try {
        const result = await database('select id,name,bio,photo from users');
        return await successHandler(res, result, 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await database('select id,name,bio,photo from users where id = ?', [id]);
        return await successHandler(res, result, 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const updatePassword = async (req, res) => {
    try {
        const {password, isOtpVerified} = req.body;
        if(!isOtpVerified) return await errorHandler(res, "Please Verify Your OTP", 401);
        const hashedPassword = bcrypt.hashSync(password, 10);
        const userId = req.userId;
        const update_pass_query = 'update users set password = ? where id = ?';
        const val = [hashedPassword, userId];
        const result = await database(update_pass_query, val);
        return await successHandler(res, "Password Updated Successfully", 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const profileUpload = async (req, res) => {
   
  try {
    const upload_response = uploadProfilePicture().single("photo");
    upload_response(req, res, async (err) => {
      if (err) {
        await next(errorHandler(res, err, 400));
      } else {
        console.log("req.file", req.file, "req.user_id", req.user_id);
        const photo = await req.file;  
        const user_id = await req.userId; 
 
        if(!photo){
          await next(errorHandler(res, "Missing profile picture", 400));
        }
        if(!user_id){
          await next(errorHandler(res, "Missing user Id", 400));
        }
       const fileName = photo.filename;
        const photo_query = 'select id,photo as photoFileName from users where id = ? and photo is not null';
        const photo_result = await database(photo_query, [user_id]);
        if(photo_result.length > 0 && photo_result[0].photoFileName){ 
            const fullPath = process.env.PROFILE_PATH + '/' + photo_result[0].photoFileName;
            console.log("fullPath", fullPath);
        fs.unlink(fullPath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deleted successfully');
        });
        } 
        const update_photo_query = 'update users set photo = ? where id = ?';
        const val = [fileName, user_id];
        await database(update_photo_query, val);
        return await successHandler(res, "Profile Picture Updated Successfully", 200); 
      }
    });
  } catch (error) {
    await next(errorHandler(res, "Server Error", 500));
  }
}