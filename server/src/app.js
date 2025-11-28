import express from "express"
import { adminAuth, userAuth } from "./middlewares/auth.js"
import User from "../src/models/user.js"
import { connectDB } from "./config/database.js"
import { validateSignUpData } from "./utils/validation.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import cookieParser from "cookie-parser"

const app = express()
const port = 7777

app.use(express.json())

app.use("/admin", adminAuth)
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
            res.cookie('token', 'j6nkj3jntzzdfjwj2pu5u5')
            res.send('Login successful!')
        }
        else 
            throw new Error('Invalid credentials')
    } catch(err){
        return res.status(400).send('ERROR : ' + err.message)
    }
})

app.get('/profile', async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.send("Reading Cookies");
})

// Feed API - get all users from DB
app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId: userEmail})
        if(!user){
            return res.status(404).send("User not found")
        }
        else res.json({user});
    } catch(err){
        return res.status(400).send("Something went wrong")
    }
})

app.get('/feed', async (req, res) => {
    const users = await User.find({});
    return res.json(users); 
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findOneAndDelete({_id: userId})
        res.send('User deleted successfully');
    } catch (err) {
        return res.status(400).send('Unable to remove the user')
    }
})

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    if(!userId) return res.send('Must provide a valid user ID');
    const data = req.body;
    const ALLOWED_UPDATES = [
        "photoUrl",
        "about",
        "gender",
        "age",
        "skills",
        "password",
    ]

    try{
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed) throw new Error('Update not allowed')
    
        if(data?.skills.length > 10) throw new Error('Cannot add more than 10 skills')
        await User.findOneAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send('User details updated successfully')
    } catch(err){
        return res.status(400).send('UPDATE FAILED: '+err.message);
    }
})

app.listen(port, () => {
  connectDB()
  console.log(`Server is listening on port ${port}`)
})
