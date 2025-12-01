import 'dotenv/config.js'
import express from "express"
import { userAuth } from "./middlewares/auth.js"
// import User from "../src/models/user.js"
import { connectDB } from "./config/database.js"
// import { validateSignUpData } from "./utils/validation.js"
// import validator from 'validator'
// import bcrypt from 'bcrypt'
import cookieParser from "cookie-parser"

import authRouter from './routes/auth.js'
import profileRouter from './routes/profile.js'
import requestRouter from './routes/request.js'

const app = express()
const port = 7777

app.use(express.json())
app.use(cookieParser())

app.use("/user", userAuth)

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

app.listen(port, () => {
  connectDB()
  console.log(`Server is listening on port ${port}`)
})
