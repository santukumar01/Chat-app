const { Socket } = require("dgram");
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server); // creating a new instnce of  socket io server

// creating routes
app.get("/", (req, res) => {
  //   res.send("Hi this is server");
  res.sendFile(path.join(__dirname, "index.html"));
});

// integrating a socket.io
// connection event for incoming socket

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });

io.on("connection", (socket) => {
  console.log("A new User connted");

  socket.on("chat-message", (data, user, callback) => {
    // console.log("msg", data);
    io.emit("chat-message", data, user); // server is sending the data to all conncetd users
    callback({
      // status: "ok",
    });
  });

  // typring event comming from client
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("stop-typing", () => {
    socket.broadcast.emit("stop-typing");
  });
  socket.on("disconnect", () => {
    console.log("User dissconnct");
  });
});
// io.on("connection", (socket) => {
//   console.log("A new User connted");
//   socket.on("chat-message", (msg) => {
//     io.emit("chat-message", msg);
//   });
// });
server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
