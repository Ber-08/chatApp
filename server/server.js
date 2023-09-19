const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./Controller/controller");

const server = http.createServer(app);

//! connection with frontend
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://chat-app-mern.pages.dev/",
    methods: ["GET", "POST"],
  },
});

//! listening with frontend and emitting

io.on("connection", (socket) => {
  console.log("server on io connected");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined!`,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", ({ message }, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

let port = 8000;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
