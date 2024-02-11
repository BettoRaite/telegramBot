const { errorHandler } = require("./helpers");
const { getData, uploadScheduleData } = require("./firebase");
const { sendMessage, sendStartMenu, handleDataSending } = require("./send");
const { handleTextDataUpload, handleImageDataUpload } = require("./dataUpload");
const { getLargestImageId } = require("./imageProccessing");
const { getUser, deleteUser, queueImageId, queueCaption } = require("./utils/user");

const { getDateUTC5 } = require("./time");
const ADMIN_IDS = process.env.ADMIN_IDS;

const { handleDataRetrival } = require("./dataRetrieval");
const { handleCommand } = require("./commandHandling");

// CONSTANS
const {
  FATAL_ERROR_MESSAGE,
  ERROR_DOC_UPLOAD_MESSAGE,
  INVALID_MESSAGE,

  HOMEWORK_UPLOAD_MESSAGE,
  ACCESS_RESTRICTED_MESSAGE,
} = require("./constantMessages");
const { UPLOAD_ACTION, GET_ACTION, ALL_COMMANDS_LIST, SET_TIME_ACTION } = require("./constants");

async function handleMessage(messageObj) {
  const messageText = messageObj.text ?? "";
  const images = messageObj.photo;
  const imageDoc = messageObj.document;
  const caption = messageObj.caption;

  if (!messageText && !images && !imageDoc) {
    errorHandler("No message text", "handleMessage", "telegram.js");
    return null;
  }

  try {
    console.log(messageText);
    const chatId = String(messageObj.chat.id);
    console.log(chatId);
    const user = getUser(chatId) ?? {};

    if (messageText.startsWith("/") || ALL_COMMANDS_LIST.includes(messageText)) {
      let command = messageText;

      return handleCommand(chatId, command, user);
    }

    if (user.action) {
      if (imageDoc) {
        await sendMessage(chatId, ERROR_DOC_UPLOAD_MESSAGE);
        sendMessage(chatId, HOMEWORK_UPLOAD_MESSAGE);
        return null;
      }
      let hasImage = false;

      if (images) {
        const imageId = getLargestImageId(images);
        // Queueing imageId, which will be extracted later and saved to database *DDN*
        queueImageId(chatId, imageId);
        hasImage = true;
      }
      if (caption) {
        queueCaption(chatId, caption);
      }
      const unixTimestamp = messageObj.date;

      const params = {
        chatId,
        subjectName: user.subjectName,
        action: user.action,
        messageText,
        hasImage,
        unixTimestamp,
      };

      handleAction(params);
      return;
    }

    sendMessage(chatId, INVALID_MESSAGE);
  } catch (error) {
    errorHandler(error, "handleMessage");
  }
}
async function handleAction(params) {
  const { chatId, subjectName, action, messageText, hasImage, unixTimestamp } = params;

  switch (action) {
    case UPLOAD_ACTION:
      if (!ADMIN_IDS?.includes(chatId)) {
        deleteUser(chatId);
        await sendMessage(chatId, ACCESS_RESTRICTED_MESSAGE);
        sendStartMenu(chatId);
        return;
      }
      // Getting date to save and retrieve data *DDN*

      const dateObj = getDateUTC5(unixTimestamp);
      const strDate = dateObj.strDate; //
      // Getting subject storage content on certain date or empty object *DDN*
      const storageContent = await getData(subjectName, strDate);

      if (!(storageContent instanceof Object && !(storageContent instanceof Array))) {
        errorHandler("storageContent is undefined", "handleAction", "telegram.js");
        await sendMessage(chatId, FATAL_ERROR_MESSAGE);
        deleteUser(chatId);
        return;
      }

      const params = {
        chatId,
        subjectName,
        strDate,
        messageText,
        storageContent,
      };

      if (messageText) {
        handleTextDataUpload(params);
      } else if (hasImage) {
        handleImageDataUpload(params);
      }
      return;

    case GET_ACTION: {
      deleteUser(chatId);

      const dataToSend = await handleDataRetrival(subjectName);

      if (Array.isArray(dataToSend)) {
        await handleDataSending(chatId, dataToSend);
      } else if (typeof dataToSend === "string") {
        await sendMessage(chatId, dataToSend);
      } else {
        await sendMessage(chatId, FATAL_ERROR_MESSAGE);
        errorHandler("dataToSend is not defined", "handleAction", "telegram.js");
      }
      await sendStartMenu(chatId);
      return;
    }
    case SET_TIME_ACTION: {
      // TEST *DNN*
      deleteUser(chatId);
      const timeIntervalsArr = processSchedule(messageText);
      await sendMessage(chatId, "Обработка расписание закончена,проверьте его правильность");
      await sendMessage(chatId, JSON.stringify(timeIntervalsArr, null, 4));
      const GROUP_NAME = "23-03";
      uploadScheduleData(GROUP_NAME, timeIntervalsArr);
      return;
      // if (schedule) {
      //   uploadTimeSchedule();
      // }
    }
    // TEST *DNN*
    default:
      throw new Error("Undefined action");
  }
}

// TEST *DNN*
function processSchedule(schedule) {
  const rawTimeIntervalsArr = schedule.split(",");
  const timeIntervalsArr = rawTimeIntervalsArr.map((rawTimeInterval) => {
    const timeInterval = rawTimeInterval.replace(/\s+/g, "");
    return timeInterval.split("-");
  });
  return timeIntervalsArr;
}
// TEST *DNN*

module.exports = {
  handleMessage,
  handleAction,
};
