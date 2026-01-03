import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
configDotenv();

export const signIn = async (req, res) => {
  try {
    console.log("Start processing of logging in request");

    const { email, password } = req.body;

    // input validation
    // add more checks for validation of email and password
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // find the user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "User doesn't exists.",
      });
    }

    // compare password with saved password (hashed)
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // issue token
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(`Error in signing in user ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signUp = async (req, res) => {
  try {
    console.log("Start processing of signing up request");
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, password is required",
      });
    }

    // check if the user already exists in our database
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // return user if required
    const updatedUser = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      message: "User signed up successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(`Error in signing up user ${error.message}`);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
