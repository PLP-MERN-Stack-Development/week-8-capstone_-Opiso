import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/layout";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [word, setWord] = useState("Who Am I?");
  const [isAsking, setIsAsking] = useState(true);
  const [showWord, setShowWord] = useState(true);

  useEffect(() => {
    let blinkCount = 0;
    let interval;

    const maxBlinks = isAsking ? 5 : 10;

    setWord(isAsking ? "Who Am I?" : "ADMIN ADMIN");

    interval = setInterval(() => {
      setShowWord((prev) => !prev);
      blinkCount++;

      if (blinkCount >= maxBlinks * 2) {
        setIsAsking((prev) => !prev);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isAsking]);

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      dispatch(hideLoading());

      if (response.data.success) {
        setUser(response.data.data.user);
        setDoctors(response.data.data.doctors);
      } else {
        toast.error("Failed to load user profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      {user?.isAdmin ? (
        <div className="text-center mt-10">
          <h1
            className={`text-4xl font-bold transition-all duration-300 mb-5 ${
              isAsking ? "text-red-600" : "text-green-600"
            }`}
            style={{ visibility: showWord ? "visible" : "hidden" }}
          >
            {word}
          </h1>
          <button className=" w-full bg-blue-300 p-7 font-lg rounded">Management Center</button>
        </div>
        
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center mt-6 text-green-700">
            Welcome {user?.isDoctor ? `Doctor ${user?.fname}` : user?.fname}
          </h1>
          <p className="text-center mb-5">Meet Your {user?.isDoctor ? 'Clients' : 'Doctor' }</p>
          <hr />

          <div className="px-6 md:px-12">
            <h2 className="text-2xl font-semibold text-pink-800 mb-6">
              Doctors
            </h2>

            <ul className="space-y-6">
              {doctors.length ? (
                doctors.map((doc) => (
                  <li
                    key={doc._id}
                    onClick={() => navigate(`/user/book-appointment/${doc._id}`)}
                    className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600 hover:shadow-lg transition cursor-pointer"
                  >
                    <h2 className="text-xl text-center font-bold text-gray-800 mb-2">
                      Dr. {doc.userId.fname} {doc.userId.lname}
                    </h2>
                    <hr className="w-2/3 mx-auto border-t-2 border-gray-300 my-4" />

                    <p className="text-gray-700 mb-1">
                      <span className="font-semibold">Specialization:</span>{" "}
                      {doc.specialization}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <span className="font-semibold">Location:</span>{" "}
                      {doc.address}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <span className="font-semibold">Phone:</span> {doc.phone}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <span className="font-semibold">Consultation Fee:</span>{" "}
                      {doc.consultationFees} KES
                    </p>

                    <div className="text-gray-700 mt-3">
                      <p className="font-semibold mb-1">Available Hours:</p>
                      <p>
                        <span className="font-medium">Mon - Fri:</span>{" "}
                        {doc.workingHours.weekdays.from} -{" "}
                        {doc.workingHours.weekdays.to}
                      </p>
                      <p>
                        <span className="font-medium">Saturday:</span>{" "}
                        {doc.workingHours.weekends.saturday.from} -{" "}
                        {doc.workingHours.weekends.saturday.to}
                      </p>
                      <p>
                        <span className="font-medium">Sunday:</span>{" "}
                        {doc.workingHours.weekends.sunday.from} -{" "}
                        {doc.workingHours.weekends.sunday.to}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No Doctors Yet</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
