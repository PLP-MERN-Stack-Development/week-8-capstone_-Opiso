import React from "react";
import Layout from "../components/layout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { showLoading, hideLoading } from "../redux/alertsSlice";

const DoctorForm = () => {
  const user = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    userId: user._id,
    phone: "",
    website: "",
    location: "",
    specialization: "",
    experience: "",
    consultationFees: "",
    workingHours: {
      weekdays: {
        from:  "",
        to:  "",
      },
      weekends: {
        day:  "",
        from: "",
        to: "",
      },
    },
    fname: user.fname,
    lname: user.lname,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fromTime" || name === "toTime") {
      setFormData((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          weekdays: {
            ...prev.workingHours.weekdays,
            [name === "fromTime" ? "from" : "to"]: value,
          },
        },
      }));
    } else if (name === "weekendFromTime" || name === "weekendToTime") {
      setFormData((prev) => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          weekends: {
            ...prev.workingHours.weekends,
            [name === "weekendFromTime" ? "from" : "to"]: value,
          },
        },
      }));
    } else if (name === "workingDays") {
      setFormData((prev) => ({
        ...prev,
        workingDays: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        consultationFees: Number(formData.consultationFees),
        workingDays: formData.workingDays || "",
      };

      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/apply-doc-account",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(response.data.message || "Application Failed");
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="page-title text-center">Apply For a Doctor's Account</h1>
        <br />
        <hr className="text-green-300" /> <br />
        <form action="" className="doc-form " onSubmit={handleSubmit}>
          <div className="">
            <div>
              <h2 className="card-title">Personal Information:</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-5">
                <label htmlFor="">Phone Number: </label>
                <input
                  type="number"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="phone"
                  onChange={handleChange}
                  placeholder="+254 7..."
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="">location: </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="location"
                  onChange={handleChange}
                  placeholder="Street or Town"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>

              <div className="mb-5">
                <label htmlFor="">Specialization: </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="specialization"
                  onChange={handleChange}
                  placeholder="Haematology, Urology etc"
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="">Experience: </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="experience"
                  onChange={handleChange}
                  placeholder="2 years"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
            </div>

            <h2 className="card-title">Proffessional Information:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-5">
                <label htmlFor="">Consultation Fees: </label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="consultationFees"
                  onChange={handleChange}
                  placeholder="500 KES"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor=""> Website</label>
                <input
                  type="text"
                  className=" p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="website"
                  onChange={handleChange}
                  placeholder="Website url"
                  required
                  style={{ width: "100%", border: "1px solid green" }}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700">
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
                      name="fromTime"
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
                      name="toTime"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">
                      Weekends (Sat-Sun):
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      Day
                    </label>
                    <select
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="workingDays"
                      //   required
                    >
                      <option value="">Select...</option>
                      <option value="weekdays">Saturday</option>
                      <option value="weekends">Sunday</option>
                      <option value="all">Sat & Sun</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm text-gray-600">
                      From
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="weekendFromTime"
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
                      name="weekendToTime"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-900 hover:bg-green-600 text-white text-2xl font-semibold py-2 px-6 rounded transition duration-200 cursor-pointer"
          >
            APPLY
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default DoctorForm;
