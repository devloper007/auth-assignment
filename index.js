import express from "express";
import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });
import cors from 'cors';
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// import { swaggerSpec } from "./utils/swagger.js";
import getAuthRoute from "./routes/authRoute.js";
import getUserRoute from "./routes/userRoute.js";


const app =  express();

// Middleware
const corsOption = {
    origin:'*' 
  }
  
app.use(cors(corsOption));
app.use(bodyParser.json());

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth-Assignment API",
            version: "1.0.0",
        },
        servers: [
            {
                url: process.env.BASE_URL,
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                        scheme: "bearer"
                }
            }
            },
            security: {
                    bearerAuth: []
        }
    },
    apis: [
           "./routes/authRoute.js",
           "./routes/userRoute.js"
            ],
};      

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.send("Server Running...");
});

app.use("/auth", getAuthRoute);
app.use("/user", getUserRoute);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });
  
  // Not found middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found.' });
  });

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})