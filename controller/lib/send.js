const { getAxiosInstance } = require("./axios");
const { SUBJECT_NAMES, UPLOAD_BTN_NAME, GET_BTN_NAME, MAIN_MENU_TEXT } = require("./constants");

const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText, replyMarkup = {}) {
  return axiosInstance
    .get("sendMessage", {
      chat_id: chatId || MY_GROUP_CHAT_ID,
      text: messageText,
      reply_markup: JSON.stringify(replyMarkup),
    })
    .catch((ex) => {
      errorHandler(ex, "sendMessage", "axios");
    });
}

function sendPhoto(chatId, imgId) {
  return axiosInstance
    .post("sendPhoto", {
      chat_id: chatId,
      photo: imgId,
    })
    .catch((ex) => {
      errorHandler(ex, "sendPhoto", "axios");
    });
}

function sendSubjectsOptionMenu(chatId) {
  try {
    const replyMarkup = {
      inline_keyboard: [],
    };

    for (const subjectName of SUBJECT_NAMES) {
      capSubjectName = subjectName.at(0).toUpperCase() + subjectName.slice(1);
      const button = [{ text: capSubjectName, callback_data: subjectName }];
      replyMarkup.inline_keyboard.push(button);
    }
    return sendMessage(chatId, "Выберите одно из опций", replyMarkup);
  } catch (error) {
    errorHandler(error, "sendSubjectsOptionMenu");
  }
}

function sendStartMenu(chatId, menuText = MAIN_MENU_TEXT) {
  let optionalParams = {
    reply_markup: {
      resize_keyboard: true,
      is_persistent: true,
      force_reply: true,
      selective: true,
      keyboard: [["HI", "SHOW"]],
    },
  };
  const replyMarkup = {
    inline_keyboard: [
      [
        { text: "Получить дз", callback_data: GET_BTN_NAME },
        { text: "Сохранить дз", callback_data: UPLOAD_BTN_NAME },
      ],
    ],
  };
  return sendMessage(chatId, menuText, optionalParams);
}

module.exports = { sendMessage, sendPhoto, sendSubjectsOptionMenu, sendStartMenu };
