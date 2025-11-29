import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const userAuth = async (req, res, next) => {
    try{
        // Read the token from the req cookies
        const {token} = req.cookies;
    
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user)
            throw new Error('User not found');
        req.user = user;
        next();
    }
    catch(err){
        return res.status(400).send('ERROR : ' + err.message);
    }
}