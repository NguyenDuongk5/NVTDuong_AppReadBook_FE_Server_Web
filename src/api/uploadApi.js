import axiosClient from "./axiosClient";

export const uploadApi = {
  uploadImage: (formData) =>
    axiosClient.post("/Upload/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
