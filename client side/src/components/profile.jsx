import React, { useContext, useEffect } from "react";
import { userContext } from "../context/user";
import { axiosInterceptor } from "../api/axios";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fun = async () => {
      await axiosInterceptor
        .get("/user")
        .then((res) => {
          setUser(res.data.email);
        })
        .catch((err) => {
          console.error(err);
          navigate("/signup");
        });
    };
    fun();
  }, []);
  const logout = (e) => {
    e.preventDefault();
    const fun = async () => {
      await axiosInterceptor
        .get("/auth/logout", { withCredentials: true })
        .then((res) => {
          setUser("");
          localStorage.removeItem("jwt");
          navigate("/signin");
        })
        .catch((err) => console.error(err));
    };
    fun();
  };
  return (
    <div>
      <h1> {user}</h1>
      <button onClick={logout}>logout</button>
    </div>
  );
}
