const express = require("express");
const cors = require("cors");
const router = require("./Router/router");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", router);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
