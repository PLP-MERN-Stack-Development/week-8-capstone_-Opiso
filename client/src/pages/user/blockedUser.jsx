import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

const BlockedUser = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate()

  if (user && !user.isBlocked) {
    return <Navigate to="/"/>
  }
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 text-center">
      <div className="bg-white p-8 rounded shadow max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          Hello, Your account has been blocked. Please contact the admin for
          assistance.
        </p>
        <button
          to="/contact-admin"
          className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate('/contact-admin')}
        >
          Contact Admin
        </button>
      </div>
    </div>
  );
};

export default BlockedUser;
