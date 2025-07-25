import React from "react";
import Layout from "../components/layout";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("unseen");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMarkAllAsSeen = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/mark-all-notifications-as-seen",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message || " Failed");
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };
  const handleDeleteAll = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/delete-all-notifications",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message || "Failed");
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="page-title">Notifications</h1>
        <div className="flex space-x-4 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab("unseen")}
            key={0}
            className={`text-sm font-medium focus:outline-none cursor-pointer ${
              activeTab === "unseen"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Unseen
          </button>
          <button
            onClick={() => setActiveTab("seen")}
            key={1}
            className={`text-sm font-medium focus:outline-none cursor-pointer ${
              activeTab === "seen"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Seen
          </button>
        </div>
        <div className="mt-4">
          {activeTab === "unseen" && (
            <div>
              <div className="flex justify-end mb-4">
                <h1
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={handleMarkAllAsSeen}
                >
                  Mark all as seen
                </h1>
              </div>

              {user.user.unseenNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="card p-3 mb-0 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    console.log("Navigating to:", notification.onClickPath);
                    navigate(notification.onClickPath);
                  }}
                >
                  <div className="border border-gray-300 p-3 rounded-lg text-sm text-gray-800">
                    {notification.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "seen" && (
            <div>
              <div className="flex justify-end mb-4">
                <h1
                  className="text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={handleDeleteAll}
                >
                  Delete All
                </h1>
              </div>

              {user.user.seenNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="card p-3 mb-0 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    navigate(notification.onClickPath);
                  }}
                >
                  <div className="border border-gray-300 p-3 rounded-lg text-sm text-gray-800">
                    {notification.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
