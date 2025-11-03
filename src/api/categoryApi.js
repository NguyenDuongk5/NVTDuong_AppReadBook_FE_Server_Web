import axiosClient from "./axiosClient";

const categoryApi = {
  // API lấy tất cả thể loại
  getAll: () => axiosClient.get("/Category/all"),
};

export default categoryApi;
