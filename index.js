const express = require("express");
const port = 3000;
//
const app = express();
const bodyParser = require("body-parser");
//
require("./db");
require("./models/User");
//
const authRoutes = require("./routes/authRoutes");
//
app.use(bodyParser.json());
app.use(authRoutes);
//
app.get("/", (req, res) => {
  res.send("This is home page");
});
// app.post("/signup", (req, res) => {
//   res.send("This is signup page");
// });
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
