import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7112", // hoặc http://localhost:5148
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
