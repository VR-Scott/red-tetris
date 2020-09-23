const express = require("express");
const io = require("socket.io")();
const { makeSocket } = require("./helpers/socket");

const app = express();
//create instance of express app to handle server creation and starting on port 6060
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 }));
const port = process.env.PORT || 6060;
app.listen(port, () =>
  console.log(`Server started on port ${port}`, "ready to play tetris"));
io.attach(2000, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

makeSocket(io);