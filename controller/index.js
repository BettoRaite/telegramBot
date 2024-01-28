const { errorHandler } = require("./lib/helpers");
const { handleMessage, handleAction } = require("./lib/telegram");
const { sendMessage, sendSubjectsOptionMenu, sendStartMenu } = require("./lib/send");
const { uploadProccessedData, getData } = require("./lib/firebase");
const { setAction, setSubject, getUser, deleteUserAfter } = require("./lib/utils/user");
const { HOMEWORK_UPLOAD_MESSAGE, NO_ACTION_CHOOSEN } = require("./lib/constantMessages");
const { SUBJECT_NAMES, UPLOAD_ACTION, GET_ACTION, TEXT_DATA_PREFIX } = require("./lib/constants");
const uniqid = require("uniqid");

async function handler(req, method) {
  try {
    const GET_METHOD = "GET";
    const POST_METHOD = "POST";

    switch (method) {
      case GET_METHOD:
        const path = req.path;
        return handleGet(path);
      case POST_METHOD:
        const callbackQuery = req.body.callback_query;
        if (callbackQuery) {
          return handleCallbackQuery(callbackQuery);
        }
    }

    const { body } = req;

    if (body && body.message) {
      const messageObj = body.message;
      await handleMessage(messageObj);
      return "Message received successfully";
    }
    return "Unknown request";
  } catch (error) {
    errorHandler(error, "mainIndexHandler", "index");
  }
}
async function handleGet(path) {
  const PROD = process.env.PROD;
  if (PROD) {
    switch (path) {
      case "/test-upload-text":
        const uniqueTextId = TEXT_DATA_PREFIX + uniqid();
        await uploadProccessedData(SUBJECT_NAMES[0], "27-1-2024", {
          [uniqueTextId]: "some data",
        });
        return "Data uploaded successfully";
      case "/test-get":
        const data = await getData(SUBJECT_NAMES[0]);
        return JSON.stringify(data, null, 4);
    }
  }
  return "Telegram bot server - Sonya.js";
}
async function handleCallbackQuery(callbackQuery) {
  try {
    const userQueryName = callbackQuery.data;
    const chatId = String(callbackQuery.message.chat.id);
    const ACTIONS = new Set([UPLOAD_ACTION, GET_ACTION]);

    if (ACTIONS.has(userQueryName)) {
      const resetTimeSec = 5 * 60;
      // Setting action for the user *DDN*
      setAction(chatId, userQueryName);
      // Deleting user after 5 min of inactivity *DDN*
      deleteUserAfter(chatId, resetTimeSec);
      // Sending menu with subjects *DDN*
      sendSubjectsOptionMenu(chatId);
      console.log(`${userQueryName} action`);

      return `handled callback query ${userQueryName} action`;
      // Checking if user has pressed any of the subject btns *DDN*
    } else if (SUBJECT_NAMES.includes(userQueryName)) {
      const { action } = getUser(chatId) ?? {};

      if (action === UPLOAD_ACTION) {
        // preparing for data upload, along with the location *DDN*
        setSubject(chatId, userQueryName);
        sendMessage(chatId, HOMEWORK_UPLOAD_MESSAGE);
        return `handled callback query ${userQueryName} subject`;
      } else if (action === GET_ACTION) {
        // preparing for sending data and the location of data *DDN*
        setSubject(chatId, userQueryName);
        // chatId, subjectName, action
        const user = getUser(chatId);
        const params = {
          chatId,
          action: user.action,
          subjectName: user.subjectName,
        };
        handleAction(params);
        return `handled callback query ${userQueryName} subject`;
      }

      await sendMessage(chatId, NO_ACTION_CHOOSEN);
      sendStartMenu(chatId);
      return;
    }
    console.log("No action choosen");

    return;
  } catch (error) {
    errorHandler(error, "handleCallbackQuery");
  }
}
JSON.stringify;

module.exports = { handler };
