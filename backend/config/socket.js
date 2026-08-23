const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: process.env.CLIENT_URL || "*" },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return next(new Error("Unauthorized"));
            socket.userId = decoded.userId;
            next();
        });
    });

    io.on("connection", (socket) => {
        socket.join(socket.userId);
    });

    return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };