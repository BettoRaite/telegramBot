import axios from "axios";
import ngrok from "ngrok";
import "dotenv/config";

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN ?? null;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

await setWebhook(BOT_TOKEN, PORT, SECRET_TOKEN);

async function setWebhook(botToken, port, secretToken) {
	try {
		if (!botToken) {
			throw new TypeError("botToken is empty.");
		}
		if (!secretToken) {
			throw new TypeError("secretToken is empty.");
		}
		const url = await ngrok.connect(port);
		if (!url) {
			throw new TypeError("URL is empty.");
		}
		const baseUrl = "https://api.telegram.org/";
		const webhookUrl = `${baseUrl}bot${botToken}/setWebhook?url=${url}&secret_token=${secretToken}`;
		const response = await axios(webhookUrl);
		if (response.data.ok) {
			console.log("Webhook was set");
			console.log("ngrok url:", url);
			return;
		}
		throw new Error("Failed to set webhook.");
	} catch (err) {
		console.error("Error while setting webhook:", err);
	}
}
