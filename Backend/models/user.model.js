import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will be hashed
    age: { type: Number },
    city: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    address: { type: String },
    allergies: {
      type: [String],
      default: [],
    },

    conditions: { type: [String], default: [] },
    bloodGroup: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    is_onboarded: {
      type: Boolean,
      default: false, // Default to 'false' for all new users
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
