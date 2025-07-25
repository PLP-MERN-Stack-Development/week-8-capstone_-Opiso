import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import Layout from "../../components/layout";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "http://localhost:5000/api/admin/get-all-users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const blockUser = async (userId, currentStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          currentStatus ? "unblock" : "block"
        } this user?`
      )
    )
      return;

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/admin/block-user",
        { userId, isBlocked: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        alert(response.data.message);
        getUsersData();
      } else {
        alert("Action failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Block error:", error);
      alert("Server error");
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="page-title text-2xl font-semibold mb-4">Users List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Created At</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="text-sm text-gray-700">
                  <td className="py-3 px-4 border-b">
                    {user.fname} {user.lname}
                  </td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <button
                      className="cursor-pointer text-red-500 hover:underline"
                      onClick={() => blockUser(user._id, user.isBlocked)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 px-4 text-center text-gray-500 italic"
                  >
                    No users found.
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

export default UsersList;
