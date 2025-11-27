import baseApi from "./baseApi";

const chapterApi = {
  getAll: () => baseApi.get("/Chapter/all"),

  insert: (data) => baseApi.post("/Chapter/insert", data),

  update: (data) => baseApi.put("/Chapter/update", data),

  delete(id) {
    return baseApi.delete("/Chapter/delete", id);
  },

  paging: (params) => baseApi.post("/Chapter/paging", params),

  count: () => baseApi.get("/Chapter/count"),

  countToday: () => baseApi.get("/Chapter/count-today"),
};

export default chapterApi;
export { chapterApi };
