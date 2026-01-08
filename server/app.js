import 'dotenv/config';
import express from "express";
import { connectDB } from "./src/config/database.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import fs from 'fs';
import authRouter from './src/routes/auth.js';
import profileRouter from './src/routes/profile.js';
import requestRouter from './src/routes/request.js';
import userRouter from './src/routes/user.js';
import path from 'path';

const app = express();
const port = process.env.PORT || 7777;

if(!fs.existsSync('uploads')){
  fs.mkdirSync('uploads');
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(cors({   
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use('/api', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/request', requestRouter);
app.use('/api/user', userRouter);

connectDB();
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
