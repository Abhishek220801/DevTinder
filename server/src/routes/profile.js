import express from 'express'
const profileRouter = express.Router();

import { userAuth } from '../middlewares/auth.js';

profileRouter.get('/profile', userAuth, async(req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

export default profileRouter;