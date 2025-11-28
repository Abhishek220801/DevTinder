import {Schema, model} from 'mongoose'
import validator from 'validator'

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid email address')
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 64,
        validate(value){
            if(!validator.isStrongPassword(value)) throw new Error('Enter a strong password: ' + value);
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender type is not a valid type")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)) throw new Error('Invalid Photo URL: ' + value);
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user",
    },
    skills: {
        type: [String],
    }
}, {timestamps: true})

const userModel = model('User', userSchema);

export default userModel;
