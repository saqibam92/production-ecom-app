import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// user model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: [true, "email already taken"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password should be at least 8 characters long"],
    },
    address: {
      type: String,
      required: [true, "address is requires"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    country: {
      type: String,
      required: [true, " country is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone no is required"],
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: { type: String },
    },
    answer: {
      type: String,
      required: [true, "Anser is required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// function
// hash function
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare  password with the user entered password
userSchema.methods.isCorrectPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT token
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_EXPIRE,
    expiresIn: "7d",
  });
};

export const userModel = mongoose.model("Users", userSchema);
export default userModel;
