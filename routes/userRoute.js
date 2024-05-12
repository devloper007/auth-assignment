import express from "express";
import { editUser, getAllUser, getPublicUser, getUserById, userProfile, updatePassword,profileUpload } from "../controller/user.js";
import { verifyToken,verifyRole } from "../controller/auth.js";

const userRoute = express.Router();

userRoute.get('/profile',verifyToken, userProfile);
userRoute.post('/edit',verifyToken, editUser);
userRoute.get('/get-public-user', getPublicUser);
userRoute.get('/all-users', verifyToken,verifyRole('admin'), getAllUser);
userRoute.get('/:id',verifyToken,getUserById);
userRoute.post('/update-password',verifyToken, updatePassword);
userRoute.post('/profile-pic-upload',verifyToken, profileUpload);

export default userRoute;