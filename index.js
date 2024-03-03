import "dotenv/config.js";

import express, { json } from "express";
import { initializeFirebaseApp, initFirestoreDb } from "./controller/lib/firebase.js";
import handler from "./controller/index.js";
// ERROR MONITORING
import Bugsnag from "@bugsnag/js";
import BugsnagPluginExpress from "@bugsnag/plugin-express";

Bugsnag.start({
  apiKey: "ba97f33efea14cf5d3a5a55c95f7a409",
  plugins: [BugsnagPluginExpress],
});

const PORT = process.env.PORT || 8080;
const app = express();
app.use(json());

const middleware = Bugsnag.getPlugin("express");
app.use(middleware.requestHandler);
app.use(middleware.requestHandler);

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
