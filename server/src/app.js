import 'dotenv/config.js'
import express from "express"
import { userAuth } from "./middlewares/auth.js"
import User from "../src/models/user.js"
import { connectDB } from "./config/database.js"
import { validateSignUpData } from "./utils/validation.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import cookieParser from "cookie-parser"
import jwt from 'jsonwebtoken'

const app = express()
const port = 7777
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json())
app.use(cookieParser())

app.use("/user", userAuth)

app.post('/signup', async (req, res) => {
    // validation of data
    try{
        validateSignUpData(req);

        // encrypt the password 
        const {firstName, lastName, emailId, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // create instance of user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        });
        
        await user.save();
        res.send('User registered successfully');
        return;
    } catch(err){
        res.status(400).json("ERROR: " + err.message);
    }
})

app.post('/login', async (req, res) => {
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)) throw new Error('Please enter a valid email address');
        const foundUser = await User.findOne({emailId})
        if(!foundUser){
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if(isPasswordValid){
            console.log(JWT_SECRET)
            const token = jwt.sign({_id: foundUser._id}, JWT_SECRET);
            res.cookie('token', token);
            res.send('Login successful!');
        }
        else 
            throw new Error('Invalid credentials')
    } catch(err){
        return res.status(400).send('ERROR : ' + err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send('Logged in user: ' + user.firstName);
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
    
})

app.post('/sendConnectionRequest', userAuth, async(req, res) => {
    const user = req.user;
    console.log('Sending a connection request');
    res.send(user.firstName + ' sent the connection request!');
})

app.listen(port, () => {
  connectDB()
  console.log(`Server is listening on port ${port}`)
})
