import axios from "axios";
import jwt_decode from "jwt-decode";
const baseUrl = "http://localhost:4000";
const axiosSimple = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
const axiosInterceptor = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInterceptor.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    const tokenDecode = jwt_decode(localStorage.getItem("jwt"));
    const exp = tokenDecode.exp;
    if (exp < Date.now() / 1000) {
      await axiosSimple
        .get("/refreshToken", { withCredentials: true })
        .then((res) => {
          localStorage.setItem("jwt", res.data.accessToken);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
  req.headers.Authorization = `Bearer ${localStorage.getItem("jwt")}`;
  return req;
});
export { axiosInterceptor, axiosSimple };
