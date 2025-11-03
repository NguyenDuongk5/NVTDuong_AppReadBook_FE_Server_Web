import axiosClient from "./axiosClient";

export const mangaApi = {
  getAll: () => axiosClient.get("/Manga/all"),

  insert: (data) => axiosClient.post("/Manga/insert", data),

  delete: (id) =>
    axiosClient.delete("/Manga/delete", {
      data: id,
      headers: { "Content-Type": "application/json" },
    }),

  count: () => axiosClient.get("/Manga/count"),

  countToday: () => axiosClient.get("/Manga/count-today"),

  paging: (page, pageSize = 10, column = "", param = "") =>
    axiosClient.post("/Manga/paging", {
      column,
      param,
      page,
      take: pageSize,
    }),

};


export const uploadApi = {
  uploadImage: (formData) =>
    axiosClient.post("/Upload/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
