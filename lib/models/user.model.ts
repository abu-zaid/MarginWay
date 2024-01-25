import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  thresholdAmount: { type: Number, required: true },
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;