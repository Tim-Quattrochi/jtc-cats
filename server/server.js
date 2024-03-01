const dotenv = require("dotenv").config();
const cors = require("cors");
const express = require("express");
const router = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request path: ${req.path}`);
  next();
});

app.use("/api", router);

app.listen(3001, () => console.log("Server is running"));
