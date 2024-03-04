import getAxiosInstance from "./axios.js";
import errorHandler from "./helpers.js";

const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

export const sendMessage = async (chatId, messageText, params = {}) => {
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
};

export const sendStartMenu = async (chatId, menuText = MAIN_MENU_TEXT) => {
  const params = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: BTN_TEXT_GET_ACTION, callback_data: GET_ACTION },
          { text: BTN_TEXT_UPLOAD_ACTION, callback_data: UPLOAD_ACTION },
        ],
      ],
    },
  };

  await sendMessage(chatId, menuText, params);
  return;
};
