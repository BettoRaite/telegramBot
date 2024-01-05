const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");
const { uploadProccessedData, getData } = require("./firebase");
const {
  INTRODUCTION_TEXT,
  SUBJECT_NAMES,
  UPLOAD_BTN_NAME,
  GET_BTN_NAME,
  UPLOAD_SUCCESS_MESSAGE,
  MAIN_MENU_TEXT,
} = require("./constants");

const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

class SubjectHandler {
  constructor() {
    this.currentSubject = "";
    this.method = "";
  }
  setSubject(subjectName) {
    if (typeof subjectName !== "string") {
      throw new TypeError("String type is expected");
    }
    this.currentSubject = subjectName.toLowerCase();
  }
  getSubject() {
    return this.currentSubject;
  }
  setMethod(methodName) {
    if (typeof methodName !== "string") {
      throw new TypeError("String type is expected");
    }

    this.method = methodName.toLowerCase();
  }
  getMethod() {
    return this.method;
  }
  reset() {
    this.currentSubject = "";
    this.method = "";
  }
}
const subjectHandler = new SubjectHandler();

function getDate(dateInSeconds) {
  const MIN_DAY = 10;
  const MIN_MONTH = 10;
  const dateInMilliseconds = dateInSeconds * 1000;
  const date = new Date(dateInMilliseconds);
  const day = Number(date.getDay());
  const month = Number(date.getMonth()) + 1;
  const year = Number(date.getFullYear());

  return `${day < MIN_DAY ? "0" + day : day}-${month < MIN_MONTH ? "0" + month : month}-${year}`;
}

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
async function handleMessage(messageObj) {
  const messageText = messageObj.text ?? "";

  if (!messageText) {
    errorHandler("No message text", "handleMessage");
    return "";
  }
  try {
    const chatId = messageObj.chat.id;

    if (messageText.charAt(0) === "/") {
      const command = messageText.slice(1).toLowerCase();
      switch (command) {
        case "cancel":
          if (subjectHandler.getSubject()) {
            subjectHandler.reset();
            return sendMessage(chatId, "Операция была отменена 👍");
          }
          return sendMessage(chatId, "Нечего отменять😐");
        case "start":
          await sendMessage(chatId, INTRODUCTION_TEXT);
          return sendStartMenu(chatId, "Опции");
      }
    }
    const method = subjectHandler.getMethod();
    if (method) {
      const dateInSeconds = messageObj.date;
      return handleMethod(method, chatId, dateInSeconds, messageText);
    }

    sendMessage(
      chatId,
      `😞 К сожалению, я только понимаю команды! 
Может если бы вы мне подарили свой мозг🧠
я бы понимала лучше) 🤩
        `
    );
  } catch (error) {
    errorHandler(error, "handleMessage");
  }
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
  const replyMarkup = {
    inline_keyboard: [
      [
        { text: "Получить дз", callback_data: GET_BTN_NAME },
        { text: "Сохранить дз", callback_data: UPLOAD_BTN_NAME },
      ],
    ],
  };
  return sendMessage(chatId, menuText, replyMarkup);
}
async function handleMethod(method, chatId, dateInSeconds, messageText) {
  try {
    switch (method) {
      case UPLOAD_BTN_NAME: {
        const subjectName = subjectHandler.getSubject();
        subjectHandler.reset();
        if (SUBJECT_NAMES.includes(subjectName)) {
          const date = getDate(dateInSeconds);
          await uploadProccessedData(subjectName, date, messageText);
          await sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);
          return sendStartMenu(chatId);
        }
        throw new Error("Invalid subject name encountered");
      }

      case GET_BTN_NAME: {
        const subjectName = subjectHandler.getSubject();
        subjectHandler.reset();
        if (SUBJECT_NAMES.includes(subjectName)) {
          const homeworkDataObj = await getData(subjectName);
          const homeworkDataMessage = JSON.stringify(homeworkDataObj);
          await sendMessage(chatId, homeworkDataMessage);
          return sendStartMenu(chatId);
        }
        throw new Error("Invalid subject name encountered");
      }
      default:
        throw new Error("Undefined method");
    }
  } catch (error) {
    errorHandler(error, "handleMethod");
  }
}
module.exports = { sendMessage, handleMessage, sendSubjectsOptionMenu, subjectHandler };
