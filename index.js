require("dotenv").config();
const express = require("express");
const { handler } = require("./controller/index");
const { initializeFirebaseApp, initFirestoreDb } = require("./controller/lib/firebase");
const keep_alive = require("./controller/lib/keep_alive");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

initializeFirebaseApp();
// initFirestoreDb();

app.post("*", async (req, res) => {
  console.log("POST request was made");
  res.send(await handler(req, "POST"));
});

app.get("*", async (req, res) => {
  console.log("GET request was made");
  res.send(await handler(req, "GET"));
});

app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Server listening on PORT", PORT);
});
