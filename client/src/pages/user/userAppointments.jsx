import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout";
import toast from "react-hot-toast";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("/api/user/user/appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        toast.error("Failed to load appointments");
      }
    } catch (err) {
      toast.error("Error fetching appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          My Appointments
        </h2>

        {appointments.map((appt) => (
          <div key={appt._id} className="border p-4 mb-4 rounded shadow">
            <p>
              <strong>Date:</strong> {appt.date} @ {appt.time}
            </p>
            <p>
              <strong>Doctor:</strong>{" "}
              {appt.doctorId?.userId?.fname} {appt.doctorId?.userId?.lname}
            </p>
            <p>
              <strong>Specialization:</strong> {appt.doctorId?.specialization}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  appt.status === "confirmed"
                    ? "text-green-600"
                    : appt.status === "pending"
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {appt.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default UserAppointments;
