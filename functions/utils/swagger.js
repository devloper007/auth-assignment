import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth-Assignment API",
            version: "1.0.0",
        },
        servers: [
            {
                url: 'http://localhost:3005/',
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

export const swaggerSpec = swaggerJSDoc(options);