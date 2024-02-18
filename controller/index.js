import errorHandler from "./lib/helpers.js";
import { handleMessage, handleAction } from "./lib/telegram.js";
import { sendMessage, sendSubjectsOptionMenu, sendStartMenu } from "./lib/send.js";
import {
  uploadProccessedData,
  getData,
  getUserGroupName,
  getGroupScheduleData,
} from "./lib/firebase.js";
import { setAction, setSubject, getUser, deleteUserAfter } from "./lib/utils/user.js";
import { HOMEWORK_UPLOAD_MESSAGE, NO_ACTION_CHOOSEN } from "./lib/constantMessages.js";
import { SUBJECT_NAMES, UPLOAD_ACTION, GET_ACTION, TEXT_DATA_PREFIX } from "./lib/constants.js";
import uniqid from "uniqid";

export default async function handler(req, method) {
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
      case "/test/users/getGroupName":
        const userGroupName = await getUserGroupName("test");
        console.log("User group:", userGroupName);
        return userGroupName;
      case "/test/groups/getGroupScheduleData":
        const scheduleData = await getGroupScheduleData("test");
        console.log("Schedule data:", scheduleData);
        return scheduleData;
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
    errorHandler(error, "handleCallbackQuery", "index.js");
  }
}
