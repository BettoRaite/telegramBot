import ngrok from "ngrok";
import axios from "axios";
import errorHandler from "./controller/lib/helpers.js";
import "dotenv/config";

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 8080;

(async function startNgrokAndSetWebhook() {
  if (!BOT_TOKEN || !PORT) {
    errorHandler(
      "Undefined BOT_TOKEN or PORT",
      "startNgrokAndSetWebhook",
      "startNgrokAndSetWebhook"
    );
    return;
  }
  const url = await ngrok.connect(PORT);
  if (url) {
    try {
      const WEBHOOK_URL = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`;
      const response = await axios(WEBHOOK_URL);
      if (response.data.ok) {
        console.log("Webhook was set");
        console.log("ngrok url:", url);
      } else {
        console.log("Couldn't set webhook");
      }
    } catch (err) {
      console.error("Error while setting webhook:", err);
    }
  }
})();
