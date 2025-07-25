import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/layout";

const UserFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const [completed, setCompleted] = useState({});

  const toggleComplete = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("/api/admin/admin/feedbacks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setFeedbacks(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to load feedbacks");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <Layout>
      <div className="m-5 space-y-4 w-2/3">
        {feedbacks.length === 0 ? (
          <p>No feedbacks found.</p>
        ) : (
          feedbacks.map((item, index) => {
            const isCompleted = completed[index];
            return (
              <div
                key={index}
                className={`p-4 rounded border shadow ${
                  isCompleted ? "bg-green-100 border-green-500" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-blue-600">
                      {item.data.subject}
                    </p>
                    <p className="text-gray-700 mt-2">{item.data.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      From: {item.data.from.fname} {item.data.from.lname} (
                      <a
                        href={`mailto:${item.data.from.email}`}
                        className="mail-link"
                      >
                        {item.data.from.email}
                      </a>
                      ) — {new Date(item.data.time).toLocaleString()}
                    </p>
                  </div>

                  <div className="ml-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={!!isCompleted}
                        onChange={() => toggleComplete(index)}
                        className="form-checkbox h-5 w-5 text-green-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Mark as Sorted
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};
export default UserFeedbacks;
