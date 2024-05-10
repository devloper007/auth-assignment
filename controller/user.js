import database from "../db/connection.js";
import { errorHandler,successHandler } from "../utils/handler.js";
import bcrypt from "bcryptjs";


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
        const {name, bio, phone, password,email, profile_visibility} = req.body;
        let hashedPassword = bcrypt.hashSync(password, 10);
        if(password){
             hashedPassword = bcrypt.hashSync(password, 10);
        }
        const userId = req.userId;
        const user_update_query = 'update users set name = ?, bio = ?, phone = ? email = ? password = ?, profile_visibility = ? where id = ?';
        const val = [name, bio, phone, email, hashedPassword, profile_visibility,userId];
        await database(user_update_query, val);
        return await successHandler(res, "User Updated Successfully", 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const getPublicUser = async (req, res) => {
    try {
        const public_user_query = 'select name,bio,photo from users where profile_visibility = "public"';
        const result = await database(public_user_query);
        return await successHandler(res, result, 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}

export const getAllUser = async (req, res) => {
    try {
        const result = await database('select name,bio,photo from users');
        return await successHandler(res, result, 200);
    } catch (error) {
        return await errorHandler(res, "Internal Server Error", 500);
    }
}