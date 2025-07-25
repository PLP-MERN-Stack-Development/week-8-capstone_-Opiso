import React from "react";
import Layout from "../../components/layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useState, useEffect } from "react";
import axios from "axios";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "http://localhost:5000/api/admin/get-all-doctors",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/admin/change-doctor-status",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        getDoctorsData();
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/delete-doctor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status) {
        alert("Doctor deleted successfully.");
        getDoctorsData();
      } else {
        alert("Failed to delete doctor.");
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
      alert("Server error while deleting doctor.");
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="page-title text-2xl font-semibold mb-4">Doctors List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow table-fixed border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Name
                </th>
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Email
                </th>
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Phone
                </th>
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Specialization
                </th>
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Experience
                </th>
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Location
                </th>
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Created At
                </th>
                <th className="py-3 px-4 border-b border-gray-400 border-r last:border-r-0">
                  Status
                </th>
                <th className="py-3 px-4 border-b border-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr
                  key={doctor.userId._id}
                  className="text-sm text-gray-700 border-t border-gray-300"
                >
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {doctor.userId.fname} {doctor.userId.lname}
                  </td>
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {doctor.userId.email}
                  </td>
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {doctor.phone}
                  </td>
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {doctor.specialization}
                  </td>
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {doctor.experience}
                  </td>
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {doctor.location}
                  </td>
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {new Date(doctor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b border-r border-gray-200 last:border-r-0">
                    {doctor.status}
                  </td>
                  <td className="flex py-4 px-4 border-b border-gray-200 last:border-b-0">
                    {doctor.status === "pending" && (
                      <>
                        <button
                          className="text-green-500 hover:underline m-1 cursor-pointer"
                          onClick={() => changeDoctorStatus(doctor, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="text-red-500 hover:underline m-1 cursor-pointer"
                          onClick={() => changeDoctorStatus(doctor, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="text-pink-700 hover:underline m-1 cursor-pointer"
                      onClick={() => deleteDoctor(doctor._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="py-4 px-4 text-center text-gray-500 italic border-t border-gray-200"
                  >
                    No Doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorsList;
