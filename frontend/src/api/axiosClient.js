import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://booking-hotel1.onrender.com",
});

export default axiosClient;
