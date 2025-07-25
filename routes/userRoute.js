const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const { type } = require("os");
const { request } = require("http");
const Appointment = require('../models/appointmentModel');

router.post("/signup", async (req, res) => {
  console.log("Incoming signup data:", req.body);
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const { fname, lname, email, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User({
      fname,
      lname,
      email,
      gender,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send({
      message: "Account created successfully",
      success: true,
      user: {
        fname: newUser.fname,
        lname: newUser.lname,
        email: newUser.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User does not Exist!", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Incorrect Password", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res
        .status(200)
        .send({ message: "Login Successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Login Error", success: false, error: error.message });
  }
});

router.post("/get-user-info-by-id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select("-password");
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        message: " ",
        success: true,
        data: user,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Auth Failed", success: false });
  }
});

router.post("/apply-doc-account", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ message: "User not found", success: false });
    }

    const doctorExist = await Doctor.findOne({ userId });
    if (doctorExist) {
      return res
        .status(200)
        .send({ message: "Doctor profile already exists", success: false });
    }

    const newDoctor = new Doctor({
      userId,
      phone: req.body.phone,
      website: req.body.website,
      location: req.body.location,
      specialization: req.body.specialization,
      experience: req.body.experience,
      consultationFees: req.body.consultationFees,
      workingHours: {
        weekdays: {
          from: req.body.workingHours?.weekdays?.from || "",
          to: req.body.workingHours?.weekdays?.to || "",
        },
        weekends: {
          saturday: {
            from: req.body.workingHours?.weekends?.saturday?.from || "",
            to: req.body.workingHours?.weekends?.saturday?.to || "",
          },
          sunday: {
            from: req.body.workingHours?.weekends?.sunday?.from || "",
            to: req.body.workingHours?.weekends?.sunday?.to || "",
          },
        },
      },
      status: "pending",
    });

    await newDoctor.save();

    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      return res
        .status(500)
        .json({ message: "Admin not found", success: false });
    }

    admin.unseenNotifications.push({
      type: "New Doctor Account Request",
      message: `${user.fname} ${user.lname} has applied for a doctor account`,
      onClickPath: "/doctorsList",
      id: newDoctor._id,
      data: {
        name: `${user.fname} ${user.lname}`,
        email: user.email,
        doctorId: newDoctor._id,
      },
    });
    await admin.save();

    res.status(201).send({
      message: "Doctor account creation request sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in /apply-doc-account:", error);
    res.status(500).json({
      message: "Error applying for doctor account",
      error: error.message,
    });
  }
});

router.post("/mark-all-notifications-as-seen", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;
    seenNotifications.push(...unseenNotifications);
    user.seenNotifications = seenNotifications;
    user.unseenNotifications = [];
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          seenNotifications: user.seenNotifications,
          unseenNotifications: [],
        },
      },
      { new: true }
    );
    if (updatedUser) updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Marking all Notifications as seen",
      error: error.message,
    });
  }
});

router.post("/delete-all-notifications", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    user.unseenNotifications = [];
    user.seenNotifications = [];
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { unseenNotifications: [], seenNotifications: [] } },
      { new: true }
    );
    if (updatedUser) updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications Deleted",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Deleting all Notifications",
      error: error.message,
    });
  }
});

router.get("/get-user-profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching user profile", error: error.message });
  }
});

router.put("/update-user-profile", auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.userId }, req.body, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating profile", error: error.message });
  }
});

router.get("/get-all-approved-doctors", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select("-password");
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    const doctors = await Doctor.find({ status: "approved" }).populate(
      "userId",
      "fname lname email"
    );
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: { user, doctors },
    });
  } catch (error) {
    res.status(500).send({
      message: "Error Fetching Doctors",
      error: error.message,
      success: false,
    });
  }
});

router.post("/contact-admin", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const { subject, message } = req.body;

    const admins = await User.find({ isAdmin: true });
    if (admins.length === 0) {
      return res
        .status(404)
        .send({ message: "No admin found", success: false });
    }

    const user = await User.findById(userId );
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    admins.forEach(async (admin) => {
      admin.unseenNotifications.push({
        type: "contact-admin-message",
        message: `New Message from ${user.fname}: ${subject}`,
        data: {
          subject,
          message,
          from: {
            fname: user.fname,
            lname: user.lname,
            email: user.email,
          },
          time: new Date(),
        },
        onClickPath: "/admin/feedbacks",
      });
      await admin.save();
    });

    res.send({ success: true, message: "Admins notified" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

router.get("/user/appointments", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate("doctorId", "specialization userId")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "fname lname" },
      })
      .sort({ date: 1, time: 1 });

    res.send({ success: true, data: appointments });
  } catch (err) {
    res.status(500).send({ success: false, message: "Failed to load appointments" });
  }
});

module.exports = router;
