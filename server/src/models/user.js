import {Schema, model} from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 50,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid email address');
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024,
        select: false,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: '{VALUE} is not a valid gender type',
        },
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(value && !validator.isURL(value)) throw new Error('Invalid Photo URL: ' + value);
        },
    },
    about: {
        type: String,
        default: "This is a default about of the user",
        trim: true, 
        maxLength: 500,
    },
    skills: {
        type: [String],
        default: [],
    },
    emailVerified: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}})

userSchema.index({firstName: 1, lastName: 1})

userSchema.methods.toJSON = function(){
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
}

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    // validate raw password before hashing 
    if(!validator.isStrongPassword(this.password, {
        minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    })){
        return next(new Error(`Your password does not meet strength requirements`))
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.getJWT = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
}

userSchema.methods.validatePassword = async function(passwordInpByUser){
    return bcrypt.compare(passwordInpByUser, this.password);
}

const userModel = model('User', userSchema);

export default userModel;
