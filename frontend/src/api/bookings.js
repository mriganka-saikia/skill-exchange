import axiosInstance from "./axiosInstance";

export const getMyBookingsApi = () => axiosInstance.get("/bookings/mine");
export const getIncomingBookingsApi = () => axiosInstance.get("/bookings/incoming");
export const getBookingByIdApi = (id) => axiosInstance.get(`/bookings/${id}`);
export const updateBookingApi = (id, data) => axiosInstance.put(`/bookings/${id}`, data);
export const updateBookingStatusApi = (id, status) =>
    axiosInstance.put(`/bookings/${id}/status`, { status });
export const createReviewApi = (bookingId, data) =>
    axiosInstance.post(`/bookings/${bookingId}/review`, data);
