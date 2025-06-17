const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes")
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users",userRoutes)

// Kết nối database
db();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(5000, () =>
  console.log(`Example app listening at http://localhost:5000`)
);
