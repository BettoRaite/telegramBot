import getAxiosInstance from "./axios.js";
import errorHandler from "./helpers.js";
import {
  MAIN_MENU_TEXT,
  INTRODUCTION_TEXT,
  BTN_TEXT_GET_ACTION,
  BTN_TEXT_UPLOAD_ACTION,
  SUBJECTS_MENU_TEXT,
} from "./constantMessages.js";
import { SUBJECT_NAMES, UPLOAD_ACTION, GET_ACTION } from "./constants.js";

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

export function sendPhoto(chatId, imageId) {
  return axiosInstance
    .post("sendPhoto", {
      chat_id: chatId,
      photo: imageId,
    })
    .catch((ex) => {
      errorHandler(ex, "sendPhoto", "axios");
    });
}
export function sendMultiplePhotos(chatId, mediaArr) {
  return axiosInstance
    .post("sendMediaGroup", {
      chat_id: chatId,
      media: mediaArr,
    })
    .catch((ex) => {
      errorHandler(ex, "sendMultiplePhotos", "axios");
    });
}
export function sendDoc(chatId, docId) {
  return axiosInstance
    .post("sendDocument", {
      chat_id: chatId,
      document: docId,
    })
    .catch((ex) => {
      errorHandler(ex, "sendDocument", "axios");
    });
}

export function sendSubjectsOptionMenu(chatId) {
  const replyMarkup = {
    inline_keyboard: [],
  };

  for (const subjectName of SUBJECT_NAMES) {
    const capSubjectName = subjectName.at(0).toUpperCase() + subjectName.slice(1);
    const button = [{ text: capSubjectName, callback_data: subjectName }];
    replyMarkup.inline_keyboard.push(button);
  }
  const params = {
    reply_markup: replyMarkup,
  };
  return sendMessage(chatId, SUBJECTS_MENU_TEXT, params);
}

export function sendMenuCommands(chatId, menuText = MAIN_MENU_TEXT) {
  const params = {
    reply_markup: {
      resize_keyboard: true,
      is_persistent: false,
      force_reply: true,
      selective: true,
      keyboard: [["продолжить"]],
    },
  };

  return sendMessage(chatId, menuText, null);
}

export function sendStartMenu(chatId, menuText = MAIN_MENU_TEXT) {
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

  return sendMessage(chatId, menuText, params);
}
export function startConversation(chatId, params) {
  const sendParams = {
    ...params,
  };
  return sendMessage(chatId, INTRODUCTION_TEXT, sendParams);
}
export async function handleDataSending(chatId, dataToSend) {
  await sendMessage(chatId, "We'are on our way!");
}
