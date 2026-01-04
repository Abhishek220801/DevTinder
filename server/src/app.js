import 'dotenv/config';
import express from "express";
import { userAuth } from "./middlewares/auth.js";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import fs from 'fs';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import requestRouter from './routes/request.js';
import userRouter from './routes/user.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 7777;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if(!fs.existsSync('uploads')){
  fs.mkdirSync('uploads');
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({    
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/user", userAuth);

app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  connectDB();
  console.log(`Server is listening on port ${port}`);
});
