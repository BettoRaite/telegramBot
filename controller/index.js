const { errorHandler } = require("./lib/helpers");
const { handleMessage } = require("./lib/telegram");
const { sendMessage, sendSubjectsOptionMenu, sendStartMenu } = require("./lib/send");
const { uploadProccessedData, getData } = require("./lib/firebase");
const { setAction, setSubject, getUser, deleteUserAfter } = require("./lib/utils/user");

const {
  SUBJECT_NAMES,
  HOMEWORK_UPLOAD_MESSAGE,
  UPLOAD_ACTION,
  GET_ACTION,
} = require("./lib/constants");
D;
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
    errorHandler(error, "mainIndexHandler");
  }
}
async function handleGet(path) {
  switch (path) {
    case "/test-upload":
      await uploadProccessedData(SUBJECT_NAMES[0], 1, "I said it works");
      return "Data uploaded successfully";
    case "/test-get":
      const data = await getData(SUBJECT_NAMES[0]);
      return JSON.stringify(data, null, 4);
    default:
      return "Telegram bot server - Sonya.js";
  }
}
async function handleCallbackQuery(callbackQuery) {
  try {
    const userQueryName = callbackQuery.data;
    const chatId = String(callbackQuery.message.chat.id);
    const ACTIONS = new Set([UPLOAD_ACTION, GET_ACTION]);

    if (ACTIONS.has(userQueryName)) {
      const resetTimeSec = 5 * 60;
      setAction(chatId, userQueryName);
      // calling reset user, if case the user doesn't send any message
      deleteUserAfter(chatId, resetTimeSec);
      sendSubjectsOptionMenu(chatId);
      console.log(`${userQueryName} action`);

      return `handled callback query ${userQueryName}`;
    } else if (SUBJECT_NAMES.includes(userQueryName)) {
      const { action } = getUser(chatId) ?? {};

      if (action === UPLOAD_ACTION) {
        // preparing for data upload, along with the location
        const user = setSubject(chatId, userQueryName);
        console.log(user, "SET SUBJECT " + userQueryName);
        sendMessage(chatId, HOMEWORK_UPLOAD_MESSAGE);
        return;
      } else if (action === GET_ACTION) {
        // preparing for sending data and the locatiion of data
        const user = setSubject(chatId, userQueryName);
        console.log(user, "SET SUBJECT " + userQueryName);
        const messageObj = {
          chat: {
            id: chatId,
          },
          text: "get",
          date: 0,
        };
        handleMessage(messageObj);
        return `handled callback query ${userQueryName}`;
      }

      sendMessage(chatId, "Упсс...сперва нужно выбрать действие");
      sendStartMenu(chatId);
      return;
    }
  } catch (error) {
    errorHandler(error, "handleCallbackQuery");
  }
}

module.exports = { handler };
/*
switch (userQueryName) {
      case UPLOAD_ACTION:
        // setting action for the current user, also starting delete user clock(in case no message appears)
        console.log(setAction(chatId, UPLOAD_ACTION), "UPLOAD action");
        // sending subject options
        sendSubjectsOptionMenu(chatId);
        return "handled callback query UPLOAD";
      case GET_ACTION:
        // setting action for the current user, also starting delete user clock(in case no message appears)
        console.log(setAction(chatId, GET_ACTION), "GET action");
        // sending subject options
        sendSubjectsOptionMenu(chatId);
        return "handled callback query GET";
      default:
        const { action } = getUser(chatId) ?? {};
        if (action === undefined) {
          errorHandler("user object is undefined", "handleCallbackQuery");
        }

        if (SUBJECT_NAMES.includes(userQueryName) && action) {
          if (action === UPLOAD_ACTION) {
            // preparing for data upload, along with the location
            const user = setSubject(chatId, userQueryName);
            console.log(user, "SET SUBJECT " + userQueryName);
            sendMessage(chatId, HOMEWORK_UPLOAD_MESSAGE);
          } else if (action === GET_ACTION) {
            // preparing for sending data and the locatiion of data
            const user = setSubject(chatId, userQueryName);
            console.log(user, "SET SUBJECT " + userQueryName);
            const messageObj = {
              chat: {
                id: chatId,
              },
              text: "get",
            };
            handleMessage(messageObj);
          }

          return "handled callback query SUBJECTS";
        }
        await sendMessage(chatId, "Упсс...сперва нужно выбрать действие");
        sendStartMenu(chatId);
    }

*/
