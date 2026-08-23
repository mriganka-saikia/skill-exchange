import axiosInstance from "../axiosinstance";
export const generateDescriptionApi = (data) => axiosInstance.post("/ai/generate-description", data);
