import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utlis/features.js";

// register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
    ) {
      return res.status(500).send({
        success: false,
        message: "please provide all fields",
      });
    }
    // check existing user
    let existingUser = await userModel.findOne({ email });
    // validation
    if (existingUser) {
      return res.status(501).send({
        success: false,
        message: "email already taken",
      });
    }
    const userData = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
    });
    res.status(201).send({
      success: true,
      message: "registration successful",
      userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "register api error",
      success: false,
      error,
    });
  }
};

// login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "please provide email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    // user validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    // check password
    const isMatch = await user.isCorrectPassword(password);
    // validation  of the password
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }
    // create token and send it to client side
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "logged in successfully",
        token,
        user,
      });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login api",
      error,
    });
  }
};

// Get user profile
export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    res.status(200).send({
      success: true,
      message: "user information is fetched",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in getting profile data" }, error);
  }
};

// logout
export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "logout successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in logout api" });
  }
};

// Update user profile
export const updateProfileController = async (req, res) => {
  try {
    console.log(req.success);
    // Get the existing user from the database
    const user = await userModel.findById(req.user._id);

    const { name, email, address, city, country, phone } = req.body;

    // Validation + Update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    // save user
    await user.save();

    res.status(200).send({
      success: true,
      message: "user profile updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in update profile api" });
  }
};

// Update user password
export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    // validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "please provide old or new password correctly",
      });
    }
    //  check old passowrd is correct or not
    const isMatch = await user.isCorrectPassword(oldPassword);
    console.log(oldPassword);
    // validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid old password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in update password api" });
  }
};

// update user profile picture
export const updateProdilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    // get file from client
    const file = getDataUri(req.file);
    // delete prev image
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    // update new image to clodinary
    const cloudinaryDB = await cloudinary.v2.uploader.upload(file.content);
    user.avatar = {
      public_id: cloudinaryDB.public_id,
      url: cloudinaryDB.secure_url,
    };
    // save function
    await user.save();

    res.status(201).send({
      success: true,
      message: "profile picture updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update prodile pic api",
      error,
    });
  }
};

// Forgot Password
export const passwordResetController = async (req, res) => {
  try {
    // user get email || newPassword || answer
    const { email, newPassword, answer } = req.body;
    // validation
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: false,
        message: "please provide all fields",
      });
    }
    // fins user
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid user or answer",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your Password has been reset. Please login",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in reset password api",
      error,
    });
  }
};
