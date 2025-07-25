import React from "react";
import Layout from "../components/layout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { showLoading, hideLoading } from "../redux/alertsSlice";

const ApplyDoctor = () => {
  const user = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    // userId: user._id,
    phone: "",
    website: "",
    location: "",
    specialization: "",
    experience: "",
    consultationFees: "",
    workingHours: {
      weekdays: {
        from: "",
        to: "",
      },
      weekends: {
        saturday: {
          from: "",
          to: "",
        },
        sunday: {
          from: "",
          to: "",
        },
      },
    },
    fname: user.fname,
    lname: user.lname,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    try {
      const payload = {
        ...formData,
        consultationFees: Number(formData.consultationFees),
        // workingDays: formData.workingDays || "",
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
                <label htmlFor="" className="text-blue-800">
                  Phone Number:{" "}
                </label>
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
                <label htmlFor="" className="text-blue-800">
                  location:{" "}
                </label>
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
                <label htmlFor="" className="text-blue-800">
                  Specialization:{" "}
                </label>
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
                <label htmlFor="" className="text-blue-800">
                  Experience:{" "}
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="mb-5">
                <label htmlFor="" className="text-blue-800">
                  Consultation Fees:{" "}
                </label>
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
                <label htmlFor="" className="text-blue-800">
                  {" "}
                  Website:
                </label>
                <input
                  type="text"
                  className=" p-2 rounded border  border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                  name="website"
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
          </div>
          <button
            type="submit"
            className="bg-green-900 hover:bg-green-600 text-white w-full text-2xl font-semibold py-2 px-6 rounded transition duration-200 cursor-pointer"
          >
            APPLY
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;
