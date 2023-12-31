const express = require("express");
const { handler } = require("./controller/index");
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const app = express();
app.use(express.json());

app.post("*", async (req, res) => {
  console.log("POST");
  res.send(await handler(req, "POST"));
});

app.get("*", async (req, res) => {
  console.log("GET");
  res.send(await handler(req, "GET"));
});
app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Server listening  on PORT", PORT);
});
