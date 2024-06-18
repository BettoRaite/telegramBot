import "dotenv/config.js";
import express from "express";
import { body, matchedData } from "express-validator";
import helmet from "helmet";
import morgan from "morgan";
import handleMessageObject from "./lib/handleMessageObject.js";
import { handleHeadersValidationErrors } from "./utils/handleValidationErrors.js";
import validateHeaders from "./utils/validateHeaders.js";
const PORT = process.env.PORT || 8080;
const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.post(
	"/",
	validateHeaders,
	handleHeadersValidationErrors,
	async (req, res) => {
		handleMessageObject(req.body).then(() => {
			console.log("Sent something to user.");
		});
		res.status(200).send({ msg: "OK" });
	},
);

app.use((req, res) => {
	res.status(404).send({ msg: "No found" });
});

app.listen(PORT, (err) => {
	if (err) {
		return console.error(err);
	}
	console.log(`Server listening on http://localhost:${PORT}`);
});
