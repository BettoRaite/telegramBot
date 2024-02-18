import "dotenv/config.js";
import express, { json } from "express";

import { initializeFirebaseApp, initFirestoreDb } from "./controller/lib/firebase.js";
import handler from "./controller/index.js";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(json());

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
app.head("*", (req, res) => {
  console.log("HEAD request was made");
  res.status(200).send();
});
app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Server listening on PORT", PORT);
});
