import { generateToken } from "../config/token.js";
import { sendVerificationCode, WelcomeEmail } from "../middleware/Email.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cookie from "cookie-parser";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).json({ message: "all  fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: "user already exist" });
    }

    if (password.length < 6) {
      return res
        .status(422)
        .json({ message: "password must be atleast six characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    // send mail to the user with the verification code

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
    });

    sendVerificationCode(user.email, verificationCode);
    const token = await generateToken(user._id);
    // store JWT in cookie named 'jwt' to match middleware expectation
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "all  fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(409).json({ message: "user does not exist" });
    }

    const isMatched = await bcrypt.compare(password, userExist.password);

    if (!isMatched) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(userExist._id);
    // store JWT in cookie named 'jwt'
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });
    const must_onboard = !userExist.is_onboarded;
    res.status(201).json({
      message: "User Logged in successfully",
      data: userExist,
      must_onboard: must_onboard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // clear the cookie where JWT is stored
    res.clearCookie("jwt");
    res.status(200).json({ message: "logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({ verificationCode: code });
    if (!user) {
      return res.status(400).json({ message: "Invalid token or Expired Code" });
    }
    ((user.isVerified = true), (user.verificationCode = undefined));
    await user.save();
    // WelcomeEmail expects (email, name) so pass in that order
    await WelcomeEmail(user.email, user.name);
    const must_onboard = !user.is_onboarded;
    return res.status(200).json({
      message: "Email verified successfully",
      must_onboard: must_onboard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying email  " });
  }
};

export const onBoard = async (req, res) => {
  try {
    const userId = req.user._id;

    const { age, gender, conditions, city, bloodGroup } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        age,
        gender,
        conditions,
        city,
        bloodGroup,
        is_onboarded: true,
      },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res
      .status(200)
      .json({ message: "onboarding successful", user: updatedUser });
  } catch (error) {
    console.log("Onboarding error", error);
    res.status(500).json({ message: "Error onboarding user" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // const user = await User.findById(req.userId).select("-password");

    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

export const updateConditions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conditions } = req.body;

    if (!conditions || !Array.isArray(conditions)) {
      return res.status(400).json({
        message: "Conditions must be an array",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { conditions },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Medical conditions updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update conditions error:", error);
    res.status(500).json({
      message: "Error updating medical conditions",
    });
  }
};
