import { io } from "socket.io-client";

const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace("/api", "");

let socket;

export const connectSocket = (token) => {
    if (socket) socket.disconnect();
    socket = io(SOCKET_URL, { auth: { token } });
    return socket;
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
    socket = null;
};

export const getSocket = () => socket;