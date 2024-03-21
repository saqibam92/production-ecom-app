import express from "express";
import {
  getUserProfileController,
  loginUser,
  logoutController,
  passwordResetController,
  registerUser,
  updatePasswordController,
  updateProdilePicController,
  updateProfileController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewears/authMiddlewear.js";
import { singleUpload } from "../middlewears/multer.js";
import { rateLimit } from "express-rate-limit";

// Rate limiting middleware to prevent spamming requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// router object
const router = express.Router();

// routes
// register
router.post("/register", limiter, registerUser);

// login
router.post("/login", limiter, loginUser);

// profile
router.get("/profile", isAuth, getUserProfileController);

// logout
router.get("/logout", logoutController);

// update profile
router.put("/update_profile", isAuth, updateProfileController);

// update password
router.put("/update_password", isAuth, updatePasswordController);

// update profile picture
router.put("/update_picture", singleUpload, isAuth, updateProdilePicController);

// forgot password
router.post("/reset-password", passwordResetController);

export default router;
