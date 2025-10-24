import axiosClient from "./axiosClient";

const mangaApi = {
  getAll: () => axiosClient.get("/Manga/all"),
  insert: (data) => axiosClient.post("/Manga/insert", data),
  delete: (id) => axiosClient.delete("/Manga/delete", {
    data: id,
    headers: { "Content-Type": "application/json" },
  }),
  count: () => axiosClient.get("/Manga/count"),
  countToday: () => axiosClient.get("/Manga/count-today"),



};

export default mangaApi;
