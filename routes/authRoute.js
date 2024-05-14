import express from "express";
import {signUp,login,loginWithGoogle, sendOTP, verifyToken, verifyOTP} from "../controller/auth.js";

const authRoute = express.Router();


const getAuthRoute = function(){
/**
	 * @swagger
	 * /auth/signup:
	 *   post:
	 *     summary: User sign up.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
     *               password:
	 *                 type: string
	 *             example:
	 *               email: "rk@gmail.com"
	 *               password: "Rakesh@123"
	 *             required:
	 *               - email
	 *               - password
	 *     responses:
	 *       '200':
	 *          description: Will successfully sign up.
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  statusCode:
	 *                    type: number
	 *                  status:
	 *                    type: string
	 *                  msg:
	 *                    type: string
	 *                  data:
	 *                    oneOf:
	 *                      - type: object
	 *                      - type: array
	 *                example:
	 *                  statusCode: 200
	 *                  status: "success"
	 *                  msgCode: "101"
	 *                  msg: "Sign up successfully"
	 *                  data: null
	 */

authRoute.post('/signup',signUp);
/**
	 * @swagger
	 * /auth/login:
	 *   post:
	 *     summary: User login.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
     *               password:
	 *                 type: string
	 *             example:
	 *               email: "rk@gmail.com"
	 *               password: "Rakesh@123"
	 *             required:
	 *               - email
	 *               - password
	 *     responses:
	 *       '200':
	 *          description: Will successfully login.
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  statusCode:
	 *                    type: number
	 *                  status:
	 *                    type: string
	 *                  msg:
	 *                    type: string
	 *                  data:
	 *                    oneOf:
	 *                      - type: object
	 *                      - type: array
	 *                example:
	 *                  statusCode: 200
	 *                  status: "success"
	 *                  msgCode: "101"
	 *                  msg: "Login successfully"
	 *                  data: null
	 */
authRoute.post('/login',login);
authRoute.post('/login-with-google',loginWithGoogle);

/**
	 * @swagger
	 * /auth/send-otp:
	 *   post:
	 *     summary: Send OTP on SMS.
     *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               phone:
	 *                 type: string
	 *             example:
	 *               phone: "7895641230"
	 *             required:
	 *               - phone
	 *     responses:
	 *       '200':
	 *          description: Will successfully send OTP.
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  statusCode:
	 *                    type: number
	 *                  status:
	 *                    type: string
	 *                  msg:
	 *                    type: string
	 *                  data:
	 *                    oneOf:
	 *                      - type: object
	 *                      - type: array
	 *                example:
	 *                  statusCode: 200
	 *                  status: "success"
	 *                  msgCode: "101"
	 *                  msg: "OTP sent successfully"
	 *                  data: null
	 */
authRoute.get('/send-otp', verifyToken, sendOTP);

/**
	 * @swagger
	 * /auth/verify-otp:
	 *   post:
	 *     summary: Verify OTP.
     *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               otp:
	 *                 type: string
	 *             example:
	 *               otp: "789564"
	 *             required:
	 *               - otp
	 *     responses:
	 *       '200':
	 *          description: Will successfully verify OTP.
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  statusCode:
	 *                    type: number
	 *                  status:
	 *                    type: string
	 *                  msg:
	 *                    type: string
	 *                  data:
	 *                    oneOf:
	 *                      - type: object
	 *                      - type: array
	 *                example:
	 *                  statusCode: 200
	 *                  status: "success"
	 *                  msgCode: "101"
	 *                  msg: "OTP verified successfully"
	 *                  data: null
	 */
authRoute.post('/verify-otp', verifyToken, verifyOTP);

    return authRoute;
}

export default getAuthRoute();