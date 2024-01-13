const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");
const { SUBJECT_NAMES, UPLOAD_ACTION, GET_ACTION, MAIN_MENU_TEXT } = require("./constants");

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

function sendPhoto(chatId, imageId) {
  console.log(imageId);
  return axiosInstance
    .post("sendPhoto", {
      chat_id: chatId,
      photo: imageId,
    })
    .catch((ex) => {
      errorHandler(ex, "sendPhoto", "axios");
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

function sendMenuCommands(chatId, menuText = MAIN_MENU_TEXT) {
  let menu = {
    resize_keyboard: true,
    is_persistent: true,
    force_reply: true,
    selective: true,
    keyboard: [["/continue - продолжить"]],
  };

  return sendMessage(chatId, menuText, menu);
}

function sendStartMenu(chatId, menuText = MAIN_MENU_TEXT) {
  const replyMarkup = {
    inline_keyboard: [
      [
        { text: "Получить дз", callback_data: GET_ACTION },
        { text: "Сохранить дз", callback_data: UPLOAD_ACTION },
      ],
    ],
  };
  return sendMessage(chatId, menuText, replyMarkup);
}

module.exports = {
  sendMessage,
  sendPhoto,
  sendSubjectsOptionMenu,
  sendStartMenu,
  sendMenuCommands,
  sendDoc,
};
