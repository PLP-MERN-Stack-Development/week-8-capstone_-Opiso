import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const BookAppointment = () => {
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState(null);
  const { doctorId } = useParams();

  

  const fetchDoctorProfile = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `http://localhost:5000/api/doctor/get-doctor-profile/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        setDoctor(response.data.data);
      } else {
        toast.error("Failed to load doctor profile");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  if (!doctor) return <p className="text-center">Loading doctor profile...</p>;

  const getDayOfWeek = (dateString) => {
    const day = new Date(dateString).getDay();
    return [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][day];
  };

  const getAvailableHours = () => {
    if (!doctor || !date) return null;
    const day = getDayOfWeek(date);

    if (
      ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day)
    ) {
      return doctor.workingHours?.weekdays;
    } else if (day === "saturday") {
      return doctor.workingHours?.weekends?.saturday;
    } else if (day === "sunday") {
      return doctor.workingHours?.weekends?.sunday;
    }

    return null;
  };

  const availableHours = getAvailableHours();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!availableHours) {
      return toast.error(
        "Doctor is not available on this date. Choose another day."
      );
    }

    if (time < availableHours.from || time > availableHours.to) {
      return toast.error(
        "Selected time is outside the doctor’s working hours."
      );
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/appointment/user/book-appointment`,
        {
          doctorId: doctor._id,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Appointment Booked!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error booking appointment.");
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-10 border border-green-300">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Book Appointment with Dr. {doctor?.userId?.fname}{" "}
          {doctor?.userId?.lname}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          <span className="text-green-500 text-lg">Availability</span>
          <br />
          Mon - Fri: {doctor?.workingHours?.weekdays?.from} -{" "}
          {doctor?.workingHours?.weekdays?.to} <br />
          Saturday: {doctor?.workingHours?.weekends?.saturday?.from} -{" "}
          {doctor?.workingHours?.weekends?.saturday?.to} <br />
          Sunday: {doctor?.workingHours?.weekends?.sunday?.from} -{" "}
          {doctor?.workingHours?.weekends?.sunday?.to}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-700 font-medium mb-2">
              Select Appointment Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="p-2 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="time" className="text-gray-700 font-medium mb-2">
              Select Appointment Time
            </label>
            <input
              type="time"
              name="time"
              id="time"
              className="p-2 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              min={availableHours?.from}
              max={availableHours?.to}
              disabled={!availableHours}
            />
          </div>

          {!availableHours && date && (
            <p className="text-red-500 text-sm mt-2">
              Doctor is not available on the selected day. Please choose
              another.
            </p>
          )}

          <button
            type="submit"
            className="bg-green-700 cursor-pointer hover:bg-green-600 text-white font-bold py-2 px-6 rounded w-full transition duration-200"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default BookAppointment;
