const http = require("http");
const express = require("express");
const app = express();

const { Server } = require("socket.io");

const httpServer = new http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (ws) => {
  console.log("new client connected");

  ws.emit("chatInfo", "Welcome to chat!");
  ws.broadcast.emit("chatInfo", "New client connected!");

  ws.on("chatMessage", (message) => {
    // console.log("got message from frontend:", message);
    ws.broadcast.emit("chatMessage", message);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const { PORT = 8083 } = process.env;

httpServer.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  };

  console.log(`Server is listening on port ${PORT}`);
});
