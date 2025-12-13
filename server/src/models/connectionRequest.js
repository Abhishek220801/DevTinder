import {Schema, model} from 'mongoose'

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["like", "pass", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true,
    },
    matchedAt: {
        type: Date, 
        default: null,
    }
}, {timestamps: true})

connectionRequestSchema.index(
    {fromUserId: 1, toUserId: 1},
    {unique: true}
);

// Block sending CR to yourself
connectionRequestSchema.pre('save', function (next) {
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error('Cannot send connection request to yourself!');
    }
    next();
})

const ConnectionRequest = model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;