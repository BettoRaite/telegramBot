import "dotenv/config.js";
import express from "express";
import {
	// eslint-disable-next-line no-unused-vars
	initializeFirebaseApp,
} from "./lib/firebase.js";
import { handleRequest } from "./requestHandler.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());

initializeFirebaseApp();

app.post("*", async (req, res) => {
	console.log("POST request was made");
	res.send(await handleRequest(req, "POST"));
});

app.get("*", async (req, res) => {
	console.log("GET request was made");
	res.send(await handleRequest(req, "GET"));
});

app.head("*", (req, res) => {
	console.log("HEAD request was made");
	res.status(200).send();
});

app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
	}
	console.log("Server listening on PORT", PORT);
});
