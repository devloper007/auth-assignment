import express from "express";
import { editUser, getAllUser, getPublicUser, userProfile } from "../controller/user.js";
import { verifyToken,adminAuth } from "../controller/auth.js";

const userRoute = express.Router();

userRoute.get('/profile',verifyToken, userProfile);
userRoute.post('/edit',verifyToken, editUser);
userRoute.get('/getPublicUser', getPublicUser);
userRoute.get('/getAllUser',adminAuth, getAllUser);

export default userRoute;