import mongoose from "mongoose";

export async function connectDB(){
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err}`);
    }
}

connectDB()
    .then(console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB : ', err))


