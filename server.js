import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// routes
// routes import
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// dotenv  config
dotenv.config();

import connectDB from "./config/mongodb.js";
// database connection
connectDB();

// stripe configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// rest object
const app = express();

// middlewears
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev")); // log requests to the console
app.use(express.json()); // parse incoming requests with JSON payloads
app.use(cors());
app.use(cookieParser());

// use routes
app.use("/api/v1", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

// listen on port
// port
const PORT = process.env.PORT || 5000;

// listen to the server
app.listen(PORT, () =>
  console.log(
    `Server is running on port ${PORT} on ${process.env.NODE_ENV} mode`
  )
);
