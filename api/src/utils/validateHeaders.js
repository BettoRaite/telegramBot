import { header } from "express-validator";
import "dotenv/config";

const SECRET_TOKEN = process.env.SECRET_TOKEN;

const validateHeaders = header("x-telegram-bot-api-secret-token").custom(
	(value) => {
		if (value !== SECRET_TOKEN) {
			throw new Error("Unauthorized access.");
		}
		return true;
	},
);
export default validateHeaders;
