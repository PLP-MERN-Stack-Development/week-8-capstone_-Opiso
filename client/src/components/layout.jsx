import React, { useEffect, useRef, useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../pages/footer";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const appName = "Pisto Wellpoint";

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/user/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Apply Doctor",
      path: "/applyDoctor",
      icon: "ri-nurse-fill",
    },
    {
      name: "Profile",
      path: `/user/profile/${user._id}`,
      icon: "ri-user-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Doctors",
      path: "/doctorsList",
      icon: "ri-user-heart-line",
    },
    {
      name: "Users",
      path: "/usersList",
      icon: "ri-nurse-fill",
    },
    {
      name: "Feedbacks",
      path: "/admin/feedbacks",
      icon: "ri-feedback-fill",
    },
    {
      name: "Profile",
      path: `/admin/profile/${user._id}`,
      icon: "ri-user-line",
    },
  ];
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-user-heart-line",
    },

    {
      name: "Profile",
      path: `/doctor-profile/${user._id}`,
      icon: "ri-user-line",
    },
  ];
  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  return (
    <div className="main p-2">
      <div className="flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>PW</h1>
            <h2 className="text-xl text-blue-400 role ms-2">{role}</h2>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`flex menu-item ${
                    isActive ? "active-menu-item" : ""
                  }`}
                >
                  <Link to={menu.path}>
                    <i className={menu.icon}></i>
                    <span>{!collapsed && menu.name}</span>
                  </Link>
                </div>
              );
            })}
            <div
              className={"flex menu-item"}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <Link to="/login">
                <i className="ri-logout-circle-r-line"></i>
                {!collapsed && "Logout"}
              </Link>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div>
              {!collapsed ? (
                <i
                  className="ri-close-large-line header-action-icon"
                  onClick={() => setCollapsed(true)}
                ></i>
              ) : (
                <i
                  className="ri-menu-line header-action-icon"
                  onClick={() => setCollapsed(false)}
                ></i>
              )}
            </div>
                            <h1 className="text-2xl text-blue-500 font-bold bg-gray-300 app-name p-3 rounded">{appName}</h1>

            <div className="flex items-center">
              <div className="relative inline-block">
                <i
                  className="ri-notification-line header-action-icon text-2xl text-gray-800"
                  onClick={() => navigate("/notifications")}
                ></i>
                {user?.unseenNotifications.length > 0 && (
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {user.unseenNotifications.length}
                  </span>
                )}
              </div>

              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
                >
                  <span className="text-gray-800 font-medium">
                    {user?.fname}
                  </span>
                  <i className="ri-arrow-down-s-line"></i>
                </button>

                {isOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md">
                    <Link
                      className="anchor"
                      to={
                        user.isDoctor
                          ? `/doctor/updateDoctorProfile`
                          : "/user/editProfile"
                      }
                    >
                      <span className="text-blue-700 hover:text-red-900 transition-colors duration-200">
                        Edit Profile
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="body">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
