import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connection = async () => {
  const res = await mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then(() => {
      console.log("MongoDB connected successfully.");
    })
    .catch((err) => {
      console.log("Error in database connection: ", err);
    });
};
