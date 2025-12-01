import express from 'express'
const requestRouter = express.Router();

import { userAuth } from '../middlewares/auth.js';
import User from '../models/user.js'
import ConnectionRequest from '../models/connectionRequest.js';

requestRouter.post('/send/:status/:toUserId', userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id; 
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: 'Invalid status type: ' + status
            })
        }

        // if there is an existing connectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest){
            res.status(400).send({message: 'Connection Request Already Exists!'})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message: 'User not found'})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        res.json({
            message: `${fromUserId} sent connection request to ${toUserId}.`,
            data,
        })
    } catch(err){
        res.status(400).send('ERROR : ' + err.message);
    }
})

export default requestRouter;

