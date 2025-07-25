const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    isDoctor: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    seenNotifications: { type: Array, default: [] },
    unseenNotifications: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
