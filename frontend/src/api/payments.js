import axiosInstance from "./axiosInstance";

export const createSkillOrderApi = (data) => axiosInstance.post("/payment/create-order", data);
export const verifySkillPaymentApi = (data) => axiosInstance.post("/payment/verify", data);