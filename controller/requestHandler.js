process.on("uncaughtException", (err) => {
  console.log("error");
});

import errorHandler from "./lib/helpers.js";
import { handleMessage } from "./lib/telegram.js";
import { ACTIONS } from "./lib/constants.js";
import { addUser, deleteUserAfter, setAction } from "./lib/utils/user.js";
// import { fetchUserGroupId, fetchGroupStudySchedules } from "./lib/firebase.js";

const handleGet = (path) => {
  const PROD = process.env.PROD;
  if (PROD) {
    switch (path) {
    }
  }
  return "Telegram bot server - Sonya.js";
}

export const handleActionSetting = () => {

}
export const isAction = () => {

}

/**
 * Handles a button callback data, by constructing a later queued user object  
 * based on user choosen action to perform or any subject.
 * @param {string} callbackQuery A callbackQuery object with data prop.
 * @returns None
 * @example
 */
export const handleBtnCallback = async(callbackQuery) => {
  try {
    const callbackData = callbackQuery.data;
    const userId = String(callbackQuery.message.chat.id);

    if (ACTIONS[callbackData]) { 
      const resetTimeSec = 5 * 60;
      // Setting action for the user *DDN*
      setAction(userId, userQueryName);
      // Deleting user after 5 min of inactivity *DDN*
      deleteUserAfter(userId, resetTimeSec);
      // Sending menu with subjects *DDN*
      sendSubjectsOptionMenu(userId);
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

    return;
  } catch (error) {
    errorHandler(error, "handleCallbackQuery");
  }
}

export async function handleRequest(req, method) {
  try {
    switch (method) {
      case "GET":
        const path = req.path;
        return handleGet(path);
      case "POST":
        const callbackQuery = req.body.callback_query;
        if(callbackQuery) {
          handleBtnCallback(callbackQuery);
          return;
        }
    }
    
    const { body } = req;

    if (body && body.message) {
      const messageObj = body.message;
      handleMessage(messageObj);
      return "Message received successfully";
    }
  } catch (error) {
    errorHandler(error, "mainIndexHandler", "index.js");
  }
}