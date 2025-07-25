const { timeStamp } = require("console");
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    phone: { type: String, required: true },
    website: { type: String, required: false },
    location: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    consultationFees: { type: Number, required: true },
    workingHours: {
      weekdays: {
        from: String,
        to: String,
      },
      weekends: {
        saturday: {
          from: String,
          to: String,
        },
        sunday: {
          from: String,
          to: String,
        },
      },
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("doctors", doctorSchema);
