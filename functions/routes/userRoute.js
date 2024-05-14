import express from "express";
import { editUser, getAllUser, getPublicUser, getUserById, userProfile, updatePassword,profileUpload } from "../controller/user.js";
import { verifyToken,verifyRole } from "../controller/auth.js";

const userRoute = express.Router();

const getUserRoute = function(){
    /**
	 * @swagger
	 * /user/public-users:
	 *   get:
	 *     summary: Get All Public User list.
	 *     responses:
	 *       200:
	 *         description:
	 */

    userRoute.get('/public-users', getPublicUser);

    /**
	 * @swagger
	 * /user/all-users:
	 *   get:
	 *     summary: Get All Users list.
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description:
	 */

    userRoute.get('/all-users', verifyToken,verifyRole('admin'), getAllUser);

    /**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get User by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to fetch
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The unique identifier of the user
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                 email:
 *                   type: string
 *                   description: The email address of the user
 *       '404':
 *         description: User not found
 */

    userRoute.get('/:id',verifyToken,getUserById);

    /**
	 * @swagger
	 * /user/update-password:
	 *   post:
	 *     summary: Update Password.
     *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               password:
	 *                 type: string
	 *               isOtpVerified:
	 *                 type: boolean
	 *             example:
	 *               password: "rk@123"
	 *               isOtpVerified: true
	 *             required:
	 *               - password
	 *               - isOtpVerified
	 *     responses:
	 *       '200':
	 *          description: Will successfully update password for verified mobile no.
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
	 *                  msg: "Password updated successfully"
	 *                  data: null
	 */

    userRoute.post('/update-password',verifyToken, updatePassword);

    /**
 * @swagger
 * /user/upload-profile-pic:
 *   post:
 *     summary: Upload Profile Picture.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             example:
 *               file: (binary data)
 *             required:
 *               - file
 *     responses:
 *       '200':
 *          description: Will successfully update password for verified mobile no.
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
 *                  msg: "Profile picture uploaded successfully"
 *                  data: null
 */

    userRoute.post('/upload-profile-pic',verifyToken, profileUpload);

        /**
	 * @swagger
	 * /user/profile:
	 *   get:
	 *     summary: Get User's Profile.
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description:
	 */
    userRoute.get('/profile',verifyToken, userProfile);

    /**
	 * @swagger
	 * /user/edit:
	 *   post:
	 *     summary: Edit User's Profile.
     *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 type: string
	 *               email:
	 *                 type: string
     *               bio:
	 *                 type: string
	 *               phone:
	 *                 type: string
     *               profile_visibility:
	 *                 type: boolean
	 *             example:
	 *               email: "rk@123"
	 *               name: "Rakesh"
     *               bio: "Rakesh is a good boy"
	 *               phone: "7895641230"
     *               profile_visibility: true
	 *             required:
	 *               - email
	 *               - profile_visibility
	 *     responses:
	 *       '200':
	 *          description: Will successfully update user's profile.
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
	 *                  msg: "Profile updated successfully"
	 *                  data: null
	 */

    userRoute.post('/edit',verifyToken, editUser);

    return userRoute;
}

export default getUserRoute();