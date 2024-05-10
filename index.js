import express from "express";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const app =  express();

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

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