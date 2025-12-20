import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const userAuth = async (req, res, next) => {
    try{
        // Read the token from the req cookies
        let token = req.cookies?.token;
        // console.log(token)
        if(!token){
            return res.status(401).send("Authentication required")
        };
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded._id).select('+password');
        if(!user) throw new Error('User not found');
        console.log(user);
        req.user = user;
        next();
    }
    catch(err){
        return res.status(400).send('ERROR : ' + err.message);
    }
}