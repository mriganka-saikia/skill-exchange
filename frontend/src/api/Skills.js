import axiosInstance from "./axiosInstance";

export const getSkillsApi = (params) => axiosInstance.get("/skills", { params });
export const getMySkillsApi = () => axiosInstance.get("/skills/mine");
export const getSkillByIdApi = (id) => axiosInstance.get(`/skills/${id}`);
export const createSkillApi = (data) => axiosInstance.post("/skills", data);
export const updateSkillApi = (id, data) => axiosInstance.put(`/skills/${id}`, data);
export const deleteSkillApi = (id) => axiosInstance.delete(`/skills/${id}`);
export const getSkillReviewsApi = (id) => axiosInstance.get(`/skills/${id}/reviews`);
export const bookSkillApi = (id, data) => axiosInstance.post(`/skills/${id}/book`, data);
