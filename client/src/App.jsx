import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import ProtectedRoutes from "./components/protectedRoutes";
import PublicRoutes from "./components/publicRoutes";
import "./index.css";
import { useSelector } from "react-redux";
import ApplyDoctor from "./pages/applyDoctor";
import Notifications from "./pages/notifications";
import UsersList from "./pages/admin/usersList";
import DoctorsList from "./pages/admin/doctorsList";
import DoctorProfile from "./pages/doctor/doctorProfile";
import UserProfile from "./pages/user/userProfile";
import AdminProfile from "./pages/admin/adminProfile";
import UpdateDoctorProfile from "./pages/doctor/updateDoctorProfile";
import UpdateUserProfile from "./pages/user/updateUserProfile";
import BookAppointment from "./pages/bookAppointment";
import BlockedUser from "./pages/user/blockedUser";
import ContactAdmin from "./pages/contactAdmin";
import UserFeedbacks from "./pages/admin/userFeedbacks";
import DoctorAppointments from "./pages/doctor/doctorAppointments";
import UserAppointments from "./pages/user/userAppointments";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
      {loading && (
        <div className="loader-parent m-3 bg-gray-100">
          <div className="loader"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoutes>
              <Signup />
            </PublicRoutes>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/applyDoctor"
          element={
            <ProtectedRoutes>
              <ApplyDoctor />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoutes>
              <Notifications />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/usersList"
          element={
            <ProtectedRoutes>
              <UsersList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/doctorsList"
          element={
            <ProtectedRoutes>
              <DoctorsList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/doctor/profile/:doctorId"
          element={
            <ProtectedRoutes>
              <DoctorProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/doctor-profile/:doctorId"
          element={
            <ProtectedRoutes>
              <DoctorProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/profile/:userId"
          element={
            <ProtectedRoutes>
              <UserProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/profile/:userId"
          element={
            <ProtectedRoutes>
              <AdminProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/doctor/updateDoctorProfile/:doctorId"
          element={
            <ProtectedRoutes>
              <UpdateDoctorProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/editProfile"
          element={
            <ProtectedRoutes>
              <UpdateUserProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/book-appointment/:doctorId"
          element={
            <ProtectedRoutes>
              <BookAppointment />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/feedbacks"
          element={
            <ProtectedRoutes>
              <UserFeedbacks />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoutes>
              <DoctorAppointments />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/user/appointments"
          element={
            <ProtectedRoutes>
              <UserAppointments />
            </ProtectedRoutes>
          }
        />
        <Route path="/user/blocked-user" element={<BlockedUser />} />
        <Route path="/contact-admin" element={<ContactAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
