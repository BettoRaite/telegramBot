const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");
const { uploadProccessedData, getData } = require("./firebase");
const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);
class SubjectHandler {
  constructor() {
    this.currentSubject = "";
  }
  setSubject(subjectName) {
    this.currentSubject = subjectName.toLowerCase();
  }
  getSubject() {
    return this.currentSubject;
  }
  reset() {
    this.currentSubject = "";
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
function sendMessage(chatId, messageText) {
  return axiosInstance
    .get("sendMessage", {
      chat_id: chatId || MY_GROUP_CHAT_ID,
      text: messageText,
    })
    .catch((ex) => {
      errorHandler(ex, "sendMessage", "axios");
    });
}
async function handleMessage(messageObj) {
  const SUBJECTS = [
    "math",
    "russian",
    "history",
    "physics",
    "chemistry",
    "geography",
    "biology",
    "obj",
    "info",
    "literature",
    "get",
  ];
  const messageText = messageObj.text ?? "";
  if (!messageText) {
    errorHandler("No message text", "handleMessage");
    return "";
  }
  try {
    const chatId = messageObj.chat.id;
    if (messageText.charAt(0) === "/") {
      const command = messageText.slice(1).toLowerCase();
      if (command === "cancel") {
        if (subjectHandler.getSubject()) {
          subjectHandler.reset();
          return sendMessage(chatId, "Операция была отменена 👍");
        }
        return sendMessage(chatId, "Нечего отменять😐");
      }
      if (SUBJECTS.includes(command)) {
        subjectHandler.setSubject(command);
        return sendMessage(chatId, "Впишите домашнее задание!🙃");
      }
      return sendMessage(chatId, "Неправильная команда 🤡");
    }
    const subjectName = subjectHandler.getSubject();
    const dateInSeconds = messageObj.date;
    const date = getDate(dateInSeconds);
    subjectHandler.reset();
    if (subjectName) {
      if (subjectName === "get" && SUBJECTS.includes(messageText)) {
        const data = await getData(messageText);
        console.log(data);
        return sendMessage(chatId, JSON.stringify(data));
      }
      await uploadProccessedData(subjectName, date, messageText);
      return sendMessage(chatId, "\u2705.");
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
module.exports = { sendMessage, handleMessage };
