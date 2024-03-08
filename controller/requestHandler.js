// eslint-disable-next-line no-undef
process.on('uncaughtException', (err) => {
  console.log('error');
});

import errorHandler from './lib/helpers.js';
import {handleMessage} from './lib/telegram.js';
// import {sendMessage, sendStartMenu} from './lib/send.js';
import {SUBJECT_NAMES, BOT_MESSAGES, ACTIONS} from './lib/constants.js';
import {getUser, setSubject, deleteUser} from './lib/utils/user.js';
import {sendMessage, sendMainReplyMenu} from './lib/send.js';
// import {
//   fetchUserGroupId,
//   fetchGroupStudySchedules,
// } from './lib/firebase.js';

const handleGet = (path) => {
  // eslint-disable-next-line no-undef
  const PROD = process.env.PROD;
  if (PROD) {
    switch (path) {
    }
  }
  return 'Telegram bot server - Sonya.js';
};

export const handleActionSetting = () => {

};
export const isAction = () => {

};


export const handleBtnCallback = async (callbackQuery) => {
  try {
    const callbackData = callbackQuery.data;
    const userId = String(callbackQuery.message.chat.id);


    if (SUBJECT_NAMES.includes(callbackData)) {
      console.log(getUser(userId));
      deleteUser(userId);
      const {action} = getUser(userId) ?? {};

      if (action === ACTIONS.uploadHomework) {
        // preparing for data upload, along with the location *DDN*
        setSubject(userId, callbackData);
        sendMessage(userId, BOT_MESSAGES.success );
        return `handled callback query ${callbackData} subject`;
      } else if (action === ACTIONS.retrieveHomework) {
        // preparing for sending data and the location of data *DDN*
        setSubject(userId, callbackData);
        // userId, subjectName, action
        // const user = getUser(userId);
        // const params = {
        //   userId,
        //   action: userId.action,
        //   subjectName: userId.subjectName,
        // };
        // handleAction(params);
        return `handled callback query ${callbackData} subject`;
      }

      await sendMainReplyMenu(userId, 'ok');
      return;
    }

    return;
  } catch (error) {
    errorHandler(error, 'handleCallbackQuery');
  }
};
/**
 * @param {Request} req request data
 * @param {string} method request method like "POST", "GET"
 * @return {undefined}
 */
export async function handleRequest(req, method) {
  try {
    switch (method) {
      case 'GET':
        const path = req.path;
        return handleGet(path);
      case 'POST':
        const callbackQuery = req.body.callback_query;
        if (callbackQuery) {
          handleBtnCallback(callbackQuery);
          return;
        }
    }

    const {body} = req;

    if (body && body.message) {
      const messageObj = body.message;
      handleMessage(messageObj);
      return 'Message received successfully';
    }
  } catch (error) {
    errorHandler(error, 'mainIndexHandler', 'index.js');
  }
}

/*
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

*/
