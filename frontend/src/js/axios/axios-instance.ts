import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env[`SERVER_ORIGIN`]
});

export default axiosInstance;