const { errorHandler } = require("./helpers");
const { uploadProccessedData, getData, uploadImageId } = require("./firebase");
const { sendMessage, sendStartMenu, sendMenuCommands, sendDoc, sendPhoto } = require("./send");
const { getLargestImageId } = require("./imageProccessing");
const { getUser, deleteUser, setImageProccessingToTrue, getResetKey } = require("./utils/user");
const { getDate, getLocalUnixTimestamp } = require("./date");

const {
  INTRODUCTION_TEXT,
  UPLOAD_ACTION,
  GET_ACTION,
  SUBJECT_NAMES,
  CANCEL_OPERATION_SUCCESS_MESSAGE,
  CANCEL_OPERATION_ERROR_MESSAGE,
  UPLOAD_SUCCESS_MESSAGE,
  ERROR_DOC_UPLOAD,
} = require("./constants");

async function handleMessage(messageObj) {
  const messageText = messageObj.text ?? "";
  const images = messageObj.photo;
  const imageDoc = messageObj.document;

  if (!messageText && !images && !imageDoc) {
    errorHandler("No message text", "handleMessage");
    return "";
  }

  try {
    const chatId = String(messageObj.chat.id);
    const user = getUser(chatId) ?? {};

    if (user.isImageProccessing && messageText) {
      // user typed text while the images were being proccessed.
      sendMessage(chatId, "huhuhuhuhuhuh if you can imagine then you can make it.");
      deleteUser(chatId);
      return sendMenuCommands(chatId);
    }
    if (messageText.startsWith("/")) {
      const command = messageText.slice(1).toLowerCase();
      return handleCommand(chatId, command, user);
    }

    if (user.action && user.subjectName) {
      if (imageDoc) {
        sendMessage(chatId, ERROR_DOC_UPLOAD);
        return null;
      }
      const imageId = getLargestImageId(images);
      const unixTimestamp = messageObj.date;
      const params = {
        chatId,
        subjectName: user.subjectName,
        action: user.action,
        resetKey: user.resetKey,
        messageText,
        imageId,
        unixTimestamp,
      };

      return handleAction(params);
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
async function handleCommand(chatId, command, user) {
  const action = user.action;

  switch (command) {
    case "cancel":
      if (action) {
        // deleting user obj and cleanig users map
        deleteUser(chatId);
        await sendMessage(chatId, CANCEL_OPERATION_SUCCESS_MESSAGE);
      } else {
        await sendMessage(chatId, CANCEL_OPERATION_ERROR_MESSAGE);
      }
      return sendStartMenu(chatId, "Опции");
    case "start":
      await sendMessage(chatId, INTRODUCTION_TEXT);
      return sendStartMenu(chatId, "Опции");
    case "continue":
      await sendStartMenu(chatId);
      return sendStartMenu(chatId, "Опции");
  }
}
async function handleAction(params) {
  const { chatId, subjectName, action, resetKey, messageText, imageId, unixTimestamp } = params;

  const timeZoneDiffsec = 5 * 3600;
  const date = getDate(getLocalUnixTimestamp(timeZoneDiffsec, unixTimestamp));
  const strDate = date.strDate;

  switch (action) {
    case UPLOAD_ACTION: {
      if (SUBJECT_NAMES.includes(subjectName)) {
        if (messageText) {
          handleTextDataUpload(chatId, subjectName, strDate, messageText);
          return;
        } else if (imageId) {
          handleImageUpload(chatId, subjectName, imageId, resetKey);
        }
      }
      errorHandler("Invalid subject name encountered", "handleAction");
      return;
    }

    case GET_ACTION: {
      deleteUser(chatId);
      return handleDataRetrival(chatId, subjectName);
    }
    default:
      throw new Error("Undefined action");
  }
}
async function handleDataRetrival(chatId, subjectName) {
  const data = await getData(subjectName);
  if (data) {
    for (const propName in data) {
      if (propName.includes("24")) {
        await sendMessage(chatId, data[propName]);
      } else if (propName.includes("photo")) {
        await sendPhoto(chatId, data[propName]);
      }
    }
    return sendStartMenu(chatId);
  }
}
async function handleTextDataUpload(chatId, subjectName, strDate, messageText) {
  await uploadProccessedData(subjectName, strDate, messageText);

  deleteUser(chatId);
  sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);

  return sendStartMenu(chatId);
}
async function handleImageUpload(chatId, subjectName, imageId, resetKey) {
  await uploadProccessedData(subjectName, "photo", imageId);

  setImageProccessingToTrue(chatId);
  setTimeout(() => {
    console.log("RUN RESET");
    if (resetKey === getResetKey(chatId)) {
      deleteUser(chatId);
      return;
    }
    return;
  }, 1000 * 5);
  return sendMessage(chatId, "IMG FILE IT'S GOOOD");
}

module.exports = {
  handleMessage,
};
