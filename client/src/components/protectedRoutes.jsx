import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, reloadUserData } from "../redux/userSlice";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";
import { useState } from "react";

const ProtectedRoutes = (props) => {
  const { user, reloadUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userChecked, setUserChecked] = useState(false);

  const getUser = async () => {
    try {
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        dispatch(reloadUserData(false));
      } else {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate("/login");
    } finally {
      setUserChecked(true);
    }
  };

  useEffect(() => {
    if (!user || reloadUser) {
      getUser();
    } else {
      setUserChecked(true);
    }
  }, [user, reloadUser]);

  if (!userChecked) {
    return null;
  }
  if (user && user.isBlocked) {
    return <Navigate to="/user/blocked-user" />;
  }
  if (user) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
