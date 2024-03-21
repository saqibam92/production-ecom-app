import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `mongodb connected ${mongoose.connection.host}`.green.underline
    );
  } catch (err) {
    console.log(`Mongodb Error ${err}`.bgRed.white);
  }
};

export default connectDB;
