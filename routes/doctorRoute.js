const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const Appointment = require("../models/appointmentModel");

router.get("/get-doctor-profile/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "fname lname email profilePicture"
    );

    if (!doctor) {
      return res
        .status(404)
        .send({ message: "Doctor not found", success: false });
    }
    res.status(200).send({ success: true, data: doctor });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching doctor profile", error: error.message });
  }
});

router.get("/doctor-profile/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.id }).populate(
      "userId",
      "fname lname email profilePicture"
    );

    if (!doctor) {
      return res
        .status(404)
        .send({ success: false, message: "Doctor not found" });
    }

    res.status(200).send({ success: true, data: doctor });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching doctor profile",
      error: error.message,
    });
  }
});

router.put("/update-doctor-profile/:id", auth, async (req, res) => {
  try {
    const { userId: userFields, ...doctorFields } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, doctorFields, {
      new: true,
    });

    if (!doctor) {
      return res
        .status(404)
        .send({ message: "Doctor not found", success: false });
    }
    if (userFields && typeof userFields === "object") {
      await User.findByIdAndUpdate(doctor.userId, userFields);
    }

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating profile", error: error.message });
  }
});

// router.put("/update-doctor-profile/:id", auth, async (req, res) => {
//   try {
//     const doctor = await Doctor.findOneAndUpdate({ userId: req.params.id }, req.body, {
//       new: true,
//     }).populate("userId", "fname lname email profilePicture");
//     if (!doctor) {
//       return res
//         .status(404)
//         .send({ message: "Doctor not found", success: false });
//     }
//     res.status(200).send({
//       success: true,
//       message: "Profile updated successfully",
//       data: doctor,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: "Error updating profile", error: error.message });
//   }
// });

router.post("/confirm-appointment", auth, async (req, res) => {
  const { appointmentId } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "confirmed" },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .send({ success: false, message: "Appointment not found" });
    }

    const user = await User.findById(appointment.userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    user.unseenNotifications.push({
      type: "Appointment Confirmed",
      message: `Your appointment on ${appointment.date} at ${appointment.time} has been confirmed.`,
      onClickPath: "user/appointments",
      data: {
        appointmentId,
      },
    });

    await user.save();

    res.send({ success: true, message: "Appointment confirmed" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Could not confirm appointment" });
  }
});

module.exports = router;
