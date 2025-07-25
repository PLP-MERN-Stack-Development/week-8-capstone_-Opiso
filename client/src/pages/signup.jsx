import React from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    fname: "",
    lname: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        formData
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("redirecting to login page");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(response.data.message || "Sign Up Failed");
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="reg-page bg-gray-700 m-3">
      <div className="max-w-[50%] mx-auto bg-white m-1 border border-green-500 rounded-lg shadow-md p-6">
        <h2 className="page-title text-xl text-blue-700 flex justify-center font-semibold mb-2">
          Registration Page
        </h2>
        <form onSubmit={handleSubmit}>
          <div className=" mb-5">
            <label>First Name:</label>
            <input
              className="p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="text"
              name="fname"
              value={formData.fname}
              placeholder="Enter First Name"
              onChange={handleChange}
              required
              style={{ width: "100%", border: "1px solid green" }}
            />
          </div>
          <div className=" mb-5">
            <label>Last Name:</label>
            <input
              className="p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="text"
              name="lname"
              value={formData.lname}
              placeholder="Enter Last Name"
              onChange={handleChange}
              required
              style={{ width: "100%", border: "1px solid green" }}
            />
          </div>
          <div className=" mb-5">
            <label>Email location:</label>
            <input
              className="p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter Email"
              onChange={handleChange}
              required
              style={{ width: "100%", border: "1px solid green" }}
            />
          </div>
          <div className=" mb-5">
            <label className="mb-1">Gender:</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="form-radio text-pink-500"
                />
                <span className="ml-2">Female</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                  className="form-radio text-gray-500"
                />
                <span className="ml-2">Other</span>
              </label>
            </div>
          </div>
          <div className=" mb-5">
            <label>Password:</label>
            <input
              className="p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter Password"
              onChange={handleChange}
              required
              style={{ width: "100%", border: "1px solid green" }}
            />
          </div>
          <div className=" mb-5">
            <label>Confirm Password:</label>
            <input
              className="p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Retype Password"
              onChange={handleChange}
              required
              style={{ width: "100%", border: "1px solid green" }}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            style={{ cursor: "pointer" }}
          >
            Register
          </button>
        </form>
        Already have an account?{" "}
        <Link to="/login">
          <span className="text-blue-600 hover:underline">Login</span>
        </Link>
      </div>

      <div className="p-1"></div>
    </div>
  );
};

export default Signup;
