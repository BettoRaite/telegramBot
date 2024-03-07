import getAxiosInstance from "./axios.js";
import errorHandler from "./helpers.js";
import { ACTIONS,BUTTON_TEXT, MENU_TEXT } from "./constants.js";

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

export const sendStartMenu = async (chatId, menuText = MENU_TEXT.main) => {
  const params = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: BUTTON_TEXT.retrieveHomework, callback_data: ACTIONS.retrieveHomework },
          { text: BUTTON_TEXT.uploadHomework, callback_data: ACTIONS.uploadHomework },
        ],
      ],
    },
  };

  await sendMessage(chatId, menuText, params);
  return;
};
