import mongoose from "mongoose";

export async function connectDB(){
    try {
        await mongoose.connect('mongodb://localhost:27017/DevTinder')
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err}`);
    }
}

connectDB()
    .then(console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB'))


