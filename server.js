require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const { DBURL } = process.env;

mongoose.connect(DBURL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Mongoose Connect");
})
.catch(() => {
    console.error("Mongoose Connect Error");
});

const PORT = process.env.PORT || 8080;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(require("./routes"));

let userCount = 0;
io.on("connection", (socket) => {
    userCount = userCount + 1;
    io.to(socket.id).emit("SET_NAME", `user${userCount}`);

    socket.on("SEND_MESSAGE", (name, text) => {
        io.emit("RECEIVE_MESSAGE", `${name}: ${text}`);
    });
});

http.listen(PORT, () => {
    console.log("SERVER LISTEN");
});