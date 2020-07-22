const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDb = require("./config/db");
const PORT = process.env.PORT || 3000;

connectDb();

app.use(bodyParser.json());

app.use("/user", require("./routes/user.js"));

app.use("*", (req, res) => res.status(404).json("Page not found"));

app.listen(PORT, () => {
  console.log("server online");
});
