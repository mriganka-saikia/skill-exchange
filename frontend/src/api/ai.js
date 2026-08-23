import axiosInstance from "./axiosInstance";
export const generateDescriptionApi = (data) => axiosInstance.post("/ai/generate-description", data);
