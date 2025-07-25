const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");

router.get("/get-all-users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error Fetching Users",
      error: error.message,
      success: false,
    });
  }
});

router.get("/get-all-doctors", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate(
      "userId",
      "fname lname email"
    );
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error Fetching Doctors",
      error: error.message,
      success: false,
    });
  }
});

router.post("/change-doctor-status", auth, async (req, res) => {
  try {
    const { doctorId, status, userId } = req.body;
    const doctor = await Doctor.findById(doctorId).populate(
      "userId",
      "fname lname email isDoctor"
    );
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }
    doctor.status = status;
    await doctor.save();

    const user = await User.findOne({ _id: userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "Account Status Changed",
      message: `Your doctor account request has been ${status}`,
      onClickPath: "/notifications",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();

    await User.findByIdAndUpdate(
      user._id,
      { unseenNotifications: unseenNotifications },
      { new: true }
    );

    res.status(201).send({
      message: "Doctor Account Status updated successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error Updating Doctor Status",
      error: error.message,
      success: false,
    });
  }
});

router.delete("/delete-doctor/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res
        .status(404)
        .send({ message: "Doctor not found", status: false });
    }
    await User.findByIdAndUpdate(deletedDoctor.userId, {
      isDoctor: false,
    });
    res
      .status(200)
      .send({ message: "Doctor deleted successfully", status: true });
  } catch (error) {
    res.status(500).send({ message: "Server error", error, status: false });
  }
});

router.post("/block-user", async (req, res) => {
  try {
    const { userId, isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).send({
      success: true,
      message: `User has been ${
        isBlocked ? "blocked" : "unblocked"
      } successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error", error });
  }
});

router.get("/admin/feedbacks", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const admin = await User.findById(userId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).send({ success: false, message: "Access denied" });
    }

    const feedbacks = admin.unseenNotifications
      .filter((n) => n.type === "contact-admin-message")
      .sort((a, b) => new Date(b.data.time) - new Date(a.data.time)); // newest first

    res.send({ success: true, data: feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

module.exports = router;
