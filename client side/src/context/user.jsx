import React, { createContext, useEffect, useState } from "react";
import { axiosInterceptor } from "../api/axios";
import { useNavigate } from "react-router-dom";
export const userContext = createContext();
export default function User({ children }) {
  const [user, setUser] = useState("");

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
