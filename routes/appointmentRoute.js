const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");

router.post("/user/book-appointment", auth, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ message: "User not found", success: false });
    }
    const doctor = await Doctor.findById(doctorId).populate("userId");
    if (!doctor) {
      return res
        .status(404)
        .send({ success: false, message: "Doctor not found" });
    }

    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) {
      return res
        .status(400)
        .send({ success: false, message: "Time slot already booked" });
    }

    const appointment = new Appointment({
      userId,
      doctorId,
      date,
      time,
      status: "pending",
    });

    await appointment.save();

    const doctorUser = await User.findById(doctor.userId._id);
    doctorUser.unseenNotifications.push({
      type: "New Appointment Request",
      message: `New appointment request from ${user.fname} ${user.lname} on ${date} at ${time}`,
      onClickPath: "/doctor/appointments",
      data: {
        appointmentId: appointment._id,
        userId,
        doctorId,
        date,
        time,
      },
    });

    await doctorUser.save();

    res.status(201).send({
      success: true,
      message: "Appointment booked successfully. Pending confirmation.",
      appointment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Booking failed",
      error: error.message,
    });
  }
});

router.get("/doctor/appointments", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res
        .status(404)
        .send({ success: false, message: "Doctor not found" });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("userId", "fname lname email")
      .sort({ date: 1, time: 1 });

    if (appointments.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No appointments found" });
    }

    res.send({ success: true, data: appointments });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error" });
  }
});

router.post("/doctor/reject-appointment", auth, async (req, res) => {
  const { appointmentId } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "rejected" },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .send({ success: false, message: "Appointment not found" });
    }

    const user = await User.findById(appointment.userId);
    user.unseenNotifications.push({
      type: "Appointment Rejected",
      message: `Your appointment on ${appointment.date} at ${appointment.time} has been rejected.`,
      onClickPath: "/user/appointments",
      data: {
        appointmentId,
      },
    });
    await user.save();
    res.send({ success: true, message: "Appointment rejected" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Could not reject appointment" });
  }
});

router.post("/doctor/block-time", auth, async (req, res) => {
  const { date, from, to } = req.body;
  try {
    const doctor = await Doctor.findOne({ userId: req.userId });
    doctor.blockedSlots.push({ date, from, to });
    await doctor.save();

    res.send({ success: true, message: "Time blocked successfully" });
  } catch (err) {
    res.status(500).send({ success: false, message: "Failed to block time" });
  }
});

module.exports = router;
