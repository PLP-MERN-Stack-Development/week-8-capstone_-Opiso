import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const { doctorId } = useParams();

  const fetchDoctorProfile = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `http://localhost:5000/api/doctor/doctor-profile/${doctorId}`,
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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Doctor Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <strong>Full Name:</strong> {doctor.userId.fname}{" "}
            {doctor.userId.lname}
          </div>
          <div>
            <strong>Email:</strong> {doctor.userId.email}
          </div>
          <div>
            <strong>Phone:</strong> {doctor.phone}
          </div>
          <div>
            <strong>Location:</strong> {doctor.location}
          </div>
          <div>
            <strong>Specialization:</strong> {doctor.specialization}
          </div>
          <div>
            <strong>Experience:</strong> {doctor.experience}
          </div>
          <div>
            <strong>Consultation Fees:</strong> {doctor.consultationFees}
          </div>
          <div>
            <strong>Website:</strong> {doctor.website || "N/A"}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Working Hours
          </h2>
          <div className="text-sm text-gray-600">
            <p>
              <strong>Weekdays:</strong>{" "}
              {doctor.workingHours?.weekdays?.from || "N/A"} -{" "}
              {doctor.workingHours?.weekdays?.to || "N/A"}
            </p>
            <p>
              <strong>Saturday:</strong>{" "}
              {doctor.workingHours?.weekends?.saturday?.from || "N/A"} -{" "}
              {doctor.workingHours?.weekends?.saturday?.to || "N/A"}
            </p>
            <p>
              <strong>Sunday:</strong>{" "}
              {doctor.workingHours?.weekends?.sunday?.from || "N/A"} -{" "}
              {doctor.workingHours?.weekends?.sunday?.to || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfile;
