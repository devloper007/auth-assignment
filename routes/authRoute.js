import express from "express";
import {signUp,login,loginWithGoogle} from "../controller/auth.js";

const authRoute = express.Router();

authRoute.post('/signup',signUp);
authRoute.post('/login',login);
authRoute.post('/loginWithGoogle',loginWithGoogle);

export default authRoute;