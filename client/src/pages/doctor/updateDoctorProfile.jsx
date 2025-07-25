import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const UpdateDoctorProfile = () => {
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();
  const { doctorId } = useParams();

  const fetchProfile = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.get(
        `http://localhost:5000/api/doctor/doctor-profile/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        const doctor = res.data.data;

        setFormData({
          ...doctor,
          fname: doctor.userId?.fname || "",
          lname: doctor.userId?.lname || "",
          email: doctor.userId?.email || "",
        });
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("weekdays.") || name.includes("weekends.")) {
      const parts = name.split(".");

      if (parts.length === 3) {
        const [dayType, dayName, timeField] = parts;
        setFormData((prev) => ({
          ...prev,
          workingHours: {
            ...prev.workingHours,
            [dayType]: {
              ...prev.workingHours[dayType],
              [dayName]: {
                ...prev.workingHours[dayType]?.[dayName],
                [timeField]: value,
              },
            },
          },
          [name]: value,
        }));
      } else if (parts.length === 2) {
        const [dayType, timeField] = parts;
        setFormData((prev) => ({
          ...prev,
          workingHours: {
            ...prev.workingHours,
            [dayType]: {
              ...prev.workingHours[dayType],
              [timeField]: value,
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, email, ...rest } = formData;

    const updatedFormData = {
      ...rest,
      userId: { fname, lname, email },
    };
    try {
      dispatch(showLoading());
      const res = await axios.put(
        `http://localhost:5000/api/doctor/update-doctor-profile/${doctorId}`,
        updatedFormData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <Layout>
      <div>
        <h1 className="page-title text-center">Update Your Doctor's Account</h1>
        <br />
        <hr className="text-green-300" /> <br />
        <div className="">
          <form action="" className="doc-form " onSubmit={handleSubmit}>
            <div>
              <h2 className="card-title">Personal Information:</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  First Name:{" "}
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="fname"
                  value={formData?.fname || ""}
                  onChange={handleChange}
                  placeholder="Dayun"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  Last Name:{" "}
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="lname"
                  value={formData?.lname || ""}
                  onChange={handleChange}
                  placeholder="Beetrat"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  Email:{" "}
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="email"
                  value={formData?.email || ""}
                  onChange={handleChange}
                  placeholder="email"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  Phone Number:{" "}
                </label>
                <input
                  type="number"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="phone"
                  value={formData?.phone || ""}
                  onChange={handleChange}
                  placeholder="+254 7..."
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  location:{" "}
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="location"
                  value={formData?.location || ""}
                  onChange={handleChange}
                  placeholder="Street or Town"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>

              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  Specialization:{" "}
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="specialization"
                  value={formData?.specialization || ""}
                  onChange={handleChange}
                  placeholder="Haematology, Urology etc"
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  Experience:{" "}
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="experience"
                  value={formData?.experience || ""}
                  onChange={handleChange}
                  placeholder="2 years"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-900 hover:bg-green-600 text-white w-full text-2xl font-semibold py-2 px-6 rounded transition duration-200 cursor-pointer"
            >
              UPDATE
            </button>
          </form>
          <form action="" className="doc-form mt-6" onSubmit={handleSubmit}>
            <h2 className="card-title">Proffessional Information:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  Consultation Fees:{" "}
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="consultationFees"
                  value={formData?.consultationFees || ""}
                  onChange={handleChange}
                  placeholder="500 KES"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  {" "}
                  Website:
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border  border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="website"
                  value={formData?.website || ""}
                  onChange={handleChange}
                  placeholder="Website url"
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-medium text-blue-800">
                  Working Hours:
                </label>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      WeekDays (Mon-Fri):
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      From
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="weekdays.from"
                      value={formData?.workingHours?.weekdays?.from || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      To
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="weekdays.to"
                      value={formData?.workingHours?.weekdays?.to || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
                  <div className="w-1/4">
                    <label className="block mb-1 text-sm text-gray-600">
                      Saturday:
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      From
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="weekends.saturday.from"
                      value={
                        formData?.workingHours?.weekends?.saturday?.from || ""
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      To
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="weekends.saturday.to"
                      value={
                        formData?.workingHours?.weekends?.saturday?.to || ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
                  <div className="w-1/4">
                    <label className="block mb-1 text-sm text-gray-600">
                      Sunday:
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      From
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="weekends.sunday.from"
                      value={
                        formData?.workingHours?.weekends?.sunday?.from || ""
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      To
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="weekends.sunday.to"
                      value={formData?.workingHours?.weekends?.sunday?.to || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-900 hover:bg-green-600 text-white w-full text-2xl font-semibold py-2 px-6 rounded transition duration-200 cursor-pointer"
            >
              UPDATE
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateDoctorProfile;
