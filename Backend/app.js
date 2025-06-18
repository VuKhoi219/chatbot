const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messageRoutes")
const conversationRouter = require("./routes/conversationRoutes")
const chatRouter = require("./routes/chatRoutes")
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRoutes)
app.use("/api/messages", messageRoutes) // Sửa từ /api/message thành /api/messages
app.use("/api/conversations", conversationRouter) // Sửa từ /api/conversation thành /api/conversations
app.use("/api/chat",chatRouter)

// Kết nối database
db();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(5000, () =>
  console.log(`Example app listening at http://localhost:5000`)
);
