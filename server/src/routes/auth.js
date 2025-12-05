import express from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'
import User from '../models/user.js'
const authRouter = express.Router();

import { validateSignUpData } from "../utils/validation.js"

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)) throw new Error('Please enter a valid email address');
        const foundUser = await User.findOne({emailId}).select('+password')
        if(!foundUser){
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = await foundUser.validatePassword(password); 
        if(isPasswordValid){
            const token = await foundUser.getJWT();
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send('Login successful!');
        }
        else 
            throw new Error('Invalid credentials')
    } catch(err){
        return res.status(400).send('ERROR : ' + err.message)
    }
})

authRouter.post('/logout', async (req, res) => {
    res
    .cookie('token', null, {
        expires: new Date(Date.now()),  // expiring the token at current time 
    }) 
    // express method chaining
    .send('Logged out successfully');
})

export default authRouter;

