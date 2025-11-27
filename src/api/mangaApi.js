import baseApi from "./baseApi";

export const mangaApi = {
  getAll: () => baseApi.get("/Manga/all"),

  insert: (data) => baseApi.post("/Manga/insert", data),

  update: (data) => baseApi.put("/Manga/update", data),

  delete: (id) => baseApi.delete("/Manga/delete", id),

  count: () => baseApi.get("/Manga/count"),

  countToday: () => baseApi.get("/Manga/count-today"),

  paging: (page, pageSize = 10, column = "", param = "") =>
    baseApi.post("/Manga/paging", {
      column,
      param,
      page,
      take: pageSize,
    }),
};
