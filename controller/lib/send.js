import getAxiosInstance from "./axios.js";
import errorHandler from "./helpers.js";

const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

export async function sendMessage(chatId, messageText, params = {}) {
  const MY_TOKEN = process.env.BOT_TOKEN;
  const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
  const axiosInstance = getAxiosInstance(BASE_URL);
  if (!(params instanceof Object && !(params instanceof Array))) {
    errorHandler(TypeError("Params must be of type object"), "sendMessage", "axios");
    return;
  }
  const {
    parse_mode = "",
    disable_notification = false,
    protect_content = false,
    reply_markup = {},
  } = params;

  const sendMessageParams = {
    chat_id: chatId,
    text: messageText,
    parse_mode,
    disable_notification,
    protect_content,
    reply_markup: JSON.stringify(reply_markup),
  };

  await axiosInstance.get("sendMessage", sendMessageParams);
}
