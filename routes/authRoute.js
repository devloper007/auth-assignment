import express from "express";
import {signUp,login,loginWithGoogle, sendOTP, verifyToken, verifyOTP} from "../controller/auth.js";

const authRoute = express.Router();
authRoute.post('/signup',signUp);
authRoute.post('/login',login);
authRoute.post('/loginWithGoogle',loginWithGoogle);
authRoute.get('/send-otp', verifyToken, sendOTP);
authRoute.post('/verify-otp', verifyToken, verifyOTP);

export default authRoute;