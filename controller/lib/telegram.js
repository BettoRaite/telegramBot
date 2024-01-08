const { errorHandler } = require("./helpers");
const { SubjectHandler } = require("./subjectHandler");
const { uploadProccessedData, getData } = require("./firebase");
const { sendMessage, sendPhoto, sendSubjectsOptionMenu, sendStartMenu } = require("./send");
const { getLargestImgId } = require("./imageProccessing");
const {
  INTRODUCTION_TEXT,
  SUBJECT_NAMES,
  UPLOAD_BTN_NAME,
  GET_BTN_NAME,
  UPLOAD_SUCCESS_MESSAGE,
  MAIN_MENU_TEXT,
} = require("./constants");

const subjectHandler = new SubjectHandler();

async function handleMessage(messageObj) {
  const messageText = messageObj.text ?? "";
  const images = messageObj.photo || messageObj.document;
  if (!messageText && !images) {
    errorHandler("No message text", "handleMessage");
    return "";
  }
  try {
    const chatId = messageObj.chat.id;
    if (images) {
      const imgId = String(getLargestImgId(images));
      subjectHandler.addImgId(imgId);
    }

    if (messageText.charAt(0) === "/") {
      const command = messageText.slice(1).toLowerCase();
      switch (command) {
        case "cancel":
          if (subjectHandler.getSubject()) {
            subjectHandler.reset();
            await sendMessage(chatId, "Операция была отменена 👍");
          } else {
            await sendMessage(chatId, "Нечего отменять😐");
          }
          return sendStartMenu(chatId, "Опции");
        case "start":
          await sendMessage(chatId, INTRODUCTION_TEXT);
          return sendStartMenu(chatId, "Опции");
      }
    }

    const action = subjectHandler.getAction();

    if (action) {
      const dateInSeconds = messageObj.date;

      return handleAction(action, chatId, dateInSeconds);
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

function getDate(dateInSeconds) {
  const MIN_DAY = 10;
  const MIN_MONTH = 10;
  const dateInMilliseconds = dateInSeconds * 1000;
  const date = new Date(dateInMilliseconds);
  const day = Number(date.getDay());
  const month = Number(date.getMonth()) + 1;
  const year = Number(date.getFullYear());
  console.log(day);
  return `${day < MIN_DAY ? "0" + day : day}-${month < MIN_MONTH ? "0" + month : month}-${year}`;
}

async function handleAction(action, chatId, dateInSeconds, messageText) {
  console.log("called handle action");
  try {
    switch (action) {
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
        throw new Error("Undefined action");
    }
  } catch (error) {
    errorHandler(error, "handleaction");
  }
}
module.exports = {
  handleMessage,
  subjectHandler,
};
