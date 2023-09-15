import axios from "axios";
import authToken from "./service/auth_token";


const token = "Bearer " + authToken();
const refreshTokenName = "refresh_token";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE_LOCAL_URL + import.meta.env.VITE_API_BASE_LOCAL_PREFIX
    : import.meta.env.VITE_API_BASE_VPS_URL + import.meta.env.VITE_API_BASE_VPS_PREFIX;

const PURE_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE_LOCAL_URL
    : import.meta.env.VITE_API_BASE_VPS_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});


const axiosInstancePrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token,
  },
});

export { PURE_BASE_URL, BASE_URL, axiosInstance, axiosInstancePrivate, refreshTokenName };
