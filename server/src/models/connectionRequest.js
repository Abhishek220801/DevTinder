import {mongoose, Schema, model} from 'mongoose'

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["pass", "like", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true,
    }
}, {timestamps: true})

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    // check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('Cannot send connection request to yourself!');
    }
    next();
})

const ConnectionRequest = model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;