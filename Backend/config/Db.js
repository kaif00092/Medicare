import mongoose from "mongoose";

export const ConnectDb = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected");
  } catch (error) {
    console.log("Error occured in mongodb", error);
  }
};

export default ConnectDb;
