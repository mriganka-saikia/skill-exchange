import axiosInstance from "./axiosInstance";

export const getAllUsersApi = (params) => axiosInstance.get("/admin/users", { params });
export const getPendingSkillsApi = () => axiosInstance.get("/admin/skills/pending");
export const verifySkillApi = (id, decision) =>
    axiosInstance.put(`/admin/skills/${id}/verify`, { decision });
export const getReportsApi = () => axiosInstance.get("/admin/reports");