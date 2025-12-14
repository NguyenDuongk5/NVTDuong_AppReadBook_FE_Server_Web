import baseApi from "./baseApi";

export const mangaApi = {
  getAll: () => baseApi.get("/Manga/all"),

  getById: (id) => baseApi.get(`/Manga/${id}`),

  insert: (data) => baseApi.post("/Manga/insert", data),

  update: (data) => baseApi.put("/Manga/update", data),

  delete: (id) => baseApi.delete("/Manga/delete", id),

  count: () => baseApi.get("/Manga/count"),

  countToday: () => baseApi.get("/Manga/count-today"),

  search: (keyword) => baseApi.get(`/Manga/search?keyword=${keyword}`),
  

  paging: (page, pageSize = 10, column = "", param = "") =>
    baseApi.post("/Manga/paging", {
      column,
      param,
      page,
      take: pageSize,
    }),
};
