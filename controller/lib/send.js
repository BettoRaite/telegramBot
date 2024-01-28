const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");
const {
  MAIN_MENU_TEXT,
  HOMEWORK_UPLOAD_MESSAGE,
  UPLOAD_SUCCESS_MESSAGE,
  CANCEL_OPERATION_SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  CANCEL_OPERATION_ERROR_MESSAGE,
  ERROR_DOC_UPLOAD_MESSAGE,
  TEXT_LIMIT_UPLOAD_REACHED_MESSAGE,
  INVALID_MESSAGE,
  INTRODUCTION_TEXT,
  BTN_TEXT_GET_ACTION,
  BTN_TEXT_UPLOAD_ACTION,
  SUBJECTS_MENU_TEXT,
} = require("./constantMessages");
const { SUBJECT_NAMES, UPLOAD_ACTION, GET_ACTION } = require("./constants");

const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText, params = {}) {
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

  return axiosInstance.get("sendMessage", sendMessageParams).catch((ex) => {
    errorHandler(ex, "sendMessage", "axios");
  });
}

function sendPhoto(chatId, imageId) {
  return axiosInstance
    .post("sendPhoto", {
      chat_id: chatId,
      photo: imageId,
    })
    .catch((ex) => {
      errorHandler(ex, "sendPhoto", "axios");
    });
}
function sendMultiplePhotos(chatId, mediaArr) {
  console.log(mediaArr);
  return axiosInstance
    .post("sendMediaGroup", {
      chat_id: chatId,
      media: mediaArr,
    })
    .catch((ex) => {
      errorHandler(ex, "sendMultiplePhotos", "axios");
    });
}
function sendDoc(chatId, docId) {
  return axiosInstance
    .post("sendDocument", {
      chat_id: chatId,
      document: docId,
    })
    .catch((ex) => {
      errorHandler(ex, "sendDocument", "axios");
    });
}

function sendSubjectsOptionMenu(chatId) {
  const replyMarkup = {
    inline_keyboard: [],
  };

  for (const subjectName of SUBJECT_NAMES) {
    capSubjectName = subjectName.at(0).toUpperCase() + subjectName.slice(1);
    const button = [{ text: capSubjectName, callback_data: subjectName }];
    replyMarkup.inline_keyboard.push(button);
  }
  const params = {
    reply_markup: replyMarkup,
  };
  return sendMessage(chatId, SUBJECTS_MENU_TEXT, params);
}

function sendMenuCommands(chatId, menuText = MAIN_MENU_TEXT) {
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

function sendStartMenu(chatId, menuText = MAIN_MENU_TEXT) {
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

module.exports = {
  sendMessage,
  sendPhoto,
  sendSubjectsOptionMenu,
  sendStartMenu,
  sendMenuCommands,
  sendDoc,
  sendMultiplePhotos,
};
