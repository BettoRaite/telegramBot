import errorHandler from "./helpers.js";
import { sendMessage, sendStartMenu, startConversation } from "./send.js";
import { deleteUser, deleteUserAfter5Min, setAction } from "./utils/user.js";
import { getStudyTimeInfo } from "./time.js";
import { handleScheduleDataFetching } from "./dataRetrieval.js";
import { processScheduleData } from "./dataProcessing.js";
import {
  CANCEL_OPERATION_SUCCESS_MESSAGE,
  CANCEL_OPERATION_ERROR_MESSAGE,
  UNKNOWN_COMMAND,
  SONYA_ABOUT_TEXT,
  SET_TIME_COMMAND_TEXT,
} from "./constantMessages.js";
import {
  SET_TIME_COMMAND,
  TIME_COMMAND,
  BACK_COMMAND,
  MAIN_COMMANDS_LIST,
  SET_TIME_ACTION,
} from "./constants.js";

export async function handleCommand(chatId, command, user, unixTimestamp) {
  const { action, subjectName } = user;

  if (command.startsWith("/")) {
    command = command.slice(1).toLowerCase();
  }
  switch (command) {
    case "cancel":
      if (action || subjectName) {
        // deleting user obj and cleanig users map
        deleteUser(chatId);
        await sendMessage(chatId, CANCEL_OPERATION_SUCCESS_MESSAGE);
      } else {
        await sendMessage(chatId, CANCEL_OPERATION_ERROR_MESSAGE);
      }
      sendStartMenu(chatId);
      return;

    case "help":
      await sendMessage(chatId, "shit");
      return;
    case "sonyawhoareyou": {
      const params = {
        parse_mode: "HTML",
      };
      await sendMessage(chatId, SONYA_ABOUT_TEXT, params);
      return;
    }
    case "main":
      await sendMessage(chatId, "Поняла 😚");
      return sendStartMenu(chatId);
    case TIME_COMMAND:
      unixTimestamp = 1708057422;
      handleTimeCommand(chatId, unixTimestamp);
      return;
    case SET_TIME_COMMAND: {
      const replyBtns = createReplyButtonsArr(BACK_COMMAND);
      console.log(BACK_COMMAND);
      const params = {
        reply_markup: {
          keyboard: [replyBtns],
          is_persistent: false,
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      };
      await sendMessage(chatId, SET_TIME_COMMAND_TEXT, params);
      // setting action for the user *DNN*
      setAction(chatId, SET_TIME_ACTION);
      deleteUserAfter5Min(chatId);
      return;
    }
    case BACK_COMMAND:
    case "start": {
      const COLS = 2;
      const keyboard = createReplyKeyboardLayout(COLS, MAIN_COMMANDS_LIST);
      const params = {
        reply_markup: {
          keyboard,
          is_persistent: false,
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      };
      if (command === BACK_COMMAND) {
        sendMessage(chatId, "Отлично!", params);
        return;
      }
      await startConversation(chatId, params);
      sendStartMenu(chatId);
      return;
    }
    default:
      await sendMessage(chatId, UNKNOWN_COMMAND);
      return;
  }
}
export function createReplyKeyboardLayout(cols, buttonsList) {
  if (!Array.isArray(buttonsList)) {
    errorHandler(
      "buttonsList is expected to be an array",
      "createReplyKeyboardLayout",
      "telegram.js"
    );
    return null;
  } else if (!Number.isFinite(cols) || !Number.isInteger(cols)) {
    errorHandler("cols is expected to be an integer", "createReplyKeyboardLayout", "telegram.js");
    return null;
  }
  const buttonsListLen = buttonsList.length;
  const MIN_COLS = 1;
  const MAX_COLS = buttonsListLen;
  // adjusting col values
  if (cols < MIN_COLS) {
    cols = MIN_COLS;
  } else if (cols > MAX_COLS) {
    cols = MAX_COLS;
  }

  const rows = Math.ceil(buttonsListLen / cols);
  const layout = [];

  for (let i = 0; i < rows; ++i) {
    // the rows control the slice, if i = 0, slice is (0, cols) *DDN*
    const slicedButtonsList = buttonsList.slice(cols * i, cols * (i + 1));
    // here createReplyButtonsArr creates an array based on sliced button list *DDN*
    layout.push(createReplyButtonsArr(...slicedButtonsList));
  }
  return layout;
}
export function createReplyButtonsArr(...buttonsList) {
  const replyButtonsArr = [];
  // iterating through commands list *DDN*
  for (const btnName of buttonsList) {
    // checking if command is a string *DDN*
    if (typeof btnName !== "string") {
      errorHandler(
        "Error processing buttonsList, btnName is expected to be of type string",
        "createReplyButtonsArr",
        "telegram.js"
      );
      return [];
    }
    // creating a reply button with the command name as text *DDN*
    const replyButton = { text: btnName };
    replyButtonsArr.push(replyButton);
  }

  return replyButtonsArr;
}
async function handleTimeCommand(chatId, unixTimestamp) {
  try {
    const scheduleData = await handleScheduleDataFetching(chatId);

    const processedScheduleData = processScheduleData(scheduleData, unixTimestamp);
    console.log(processedScheduleData);
    const localUnixTimestamp = unixTimestamp + 5 * 3600;

    const timeInfo = getStudyTimeInfo(localUnixTimestamp, processedScheduleData);
    await sendMessage(chatId, timeInfo);
  } catch (err) {
    console.log(err);
  }
}
