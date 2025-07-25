import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout";
import toast from "react-hot-toast";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [blockDate, setBlockDate] = useState("");
  const [blockFrom, setBlockFrom] = useState("");
  const [blockTo, setBlockTo] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/appointment/doctor/appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments(res.data.data);
    } catch (err) {
      toast.error("Error loading appointments");
    }
  };

  const confirmAppointment = async (id) => {
    try {
      const res = await axios.post(
        "/api/doctor/confirm-appointment",
        { appointmentId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Confirmed");
      fetchAppointments();
    } catch (err) {
      toast.error("Error confirming appointment");
    }
  };

  const blockTime = async () => {
    try {
      await axios.post(
        "/api/doctor/block-time",
        { date: blockDate, from: blockFrom, to: blockTo },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Time blocked");
    } catch (err) {
      toast.error("Failed to block time");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Your Appointments
        </h2>
        {appointments.map((appt) => (
          <div key={appt._id} className="border p-4 mb-4 rounded shadow">
            <p>
              <strong>Date:</strong> {appt.date} @ {appt.time}
            </p>
            <p>
              <strong>Patient Name:</strong> {appt.userId.fname}{" "}
              {appt.userId.lname}
            </p>
            <p>
                <strong>Email: </strong>
              <a href={`mailto: ${appt.userId.email}`} className="mail-link">
                {appt.userId.email}
              </a>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  appt.status === "confirmed"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {appt.status}
              </span>
            </p>
            {appt.status === "pending" && (
              <button
                onClick={() => confirmAppointment(appt._id)}
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Confirm
              </button>
            )}
          </div>
        ))}

        <hr className="my-6" />
        <h3 className="text-xl font-semibold mb-2 text-red-600">Block Hours</h3>
        <div className="space-y-2">
          <input
            type="date"
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="time"
            value={blockFrom}
            onChange={(e) => setBlockFrom(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="time"
            value={blockTo}
            onChange={(e) => setBlockTo(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={blockTime}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Block Time
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorAppointments;
