import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://192.168.1.75:8000",
  withCredentials: true,
});

export default axiosInstance;
