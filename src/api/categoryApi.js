import baseApi from "./baseApi";

const categoryApi = {
  getAll: () => baseApi.get("/Category/all"),
};

export default categoryApi;
