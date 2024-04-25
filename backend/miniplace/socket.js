const http = require("http");
const socketIO = require("socket.io");

const socketServer = http.createServer();
const io = socketIO(socketServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
    console.log(`Client joined room: ${roomCode}`);
  });

  socket.on("pixelUpdate", ({ roomCode, pixelIndex, color }) => {
    socket.to(roomCode).emit("pixelUpdate", { pixelIndex, color });
  });

  socket.on("requestGridState", (roomCode) => {
    socket.to(roomCode).emit("requestGridState");
  });

  socket.on("gridState", ({ roomCode, grid }) => {
    socket.to(roomCode).emit("gridState", grid);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = {
  socketServer,
  io,
};
