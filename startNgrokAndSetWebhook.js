require("dotenv").config();
const ngrok = require("ngrok");
const axios = require("axios");

BOT_TOKEN = process.env.BOT_TOKEN;
PORT = process.env.PORT;

(async function startNgrokAndSetWebhook() {
  const url = await ngrok.connect(PORT);
  if (url) {
    try {
      const WEBHOOK_URL = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${url}`;
      const response = await axios(WEBHOOK_URL);
      if (response.data.ok) {
        console.log("Webhook was set");
      } else {
        console.log("Couldn't set webhook");
      }
    } catch (err) {
      console.error("Error while setting webhook:", err);
    }
  }
})();
