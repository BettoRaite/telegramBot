/* eslint-disable camelcase */
import getAxiosInstance from './axios.js';
import errorHandler from './helpers.js';
import {ACTIONS, BOT_MESSAGES, BUTTON_TEXT, MENU_TEXT} from './constants.js';
import {SUBJECT_NAMES, COMMANDS} from './constants.js';
import {createReplyKeyboardLayout} from './commandHandling.js';
// eslint-disable-next-line no-undef
const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);


export const sendMessage = async (chatId, messageText, params = {}) => {
  if (!(params instanceof Object && !(params instanceof Array))) {
    errorHandler(
        new TypeError('Params must be of type object'),
        sendMessage.name,
        'axios');
    return;
  }
  const {
    parse_mode = '',
    disable_notification = false,
    protect_content = false,
    reply_markup = {},
  } = params;

  const sendMessageParams = {
    chat_id: chatId,
    text: messageText,
    parse_mode,
    disable_notification,
    protect_content,
    reply_markup: JSON.stringify(reply_markup),
  };

  await axiosInstance.get('sendMessage', sendMessageParams);
};

export const sendStartMenu = async (chatId, menuText = MENU_TEXT.main) => {
  const params = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: BUTTON_TEXT.retrieveHomework,
            callback_data: ACTIONS.retrieveHomework,
          },
          {
            text: BUTTON_TEXT.uploadHomework,
            callback_data: ACTIONS.uploadHomework,
          },
        ],
      ],
    },
  };

  await sendMessage(chatId, menuText, params);
  return;
};

export const sendSubjectsOptionMenu = (chatId) => {
  const replyMarkup = {
    inline_keyboard: [],
  };

  for (const subjectName of SUBJECT_NAMES) {
    const capSubjectName =
    subjectName.at(0).toUpperCase() + subjectName.slice(1);
    const button = [
      {
        text: capSubjectName,
        callback_data: subjectName,
      }];
    replyMarkup.inline_keyboard.push(button);
  }
  const params = {
    reply_markup: replyMarkup,
  };
  sendMessage(chatId, BOT_MESSAGES.success, params);
  return;
};

export const sendMainReplyMenu = async (userId, messageText) => {
  const COLS = 2;
  const buttons = [
    COMMANDS.custom.retrieveHomework,
    COMMANDS.custom.uploadHomework,
    COMMANDS.custom.schedule,
    COMMANDS.custom.time,
    COMMANDS.custom.settings,
  ];
  const keyboard = createReplyKeyboardLayout(buttons, COLS);
  const params = {
    reply_markup: {
      keyboard,
      is_persistent: false,
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };
  await sendMessage(userId, BOT_MESSAGES.success, params);
};
