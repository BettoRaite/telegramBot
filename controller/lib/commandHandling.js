import errorHandler from "./helpers.js";
import { sendMessage, sendStartMenu } from "./send.js";
import { fetchUserGroupId, fetchDataOnGroup } from "./firebase.js";
import { getStudyTimeInfo, getLocalTime } from "./time.js";
import { filterThisWeekdayStudySchedule, processTimeInfo } from "./dataProcessing.js";
import { COMMANDS, BOT_MESSAGES, MENU_TEXT } from "./constants.js";
import { isObject } from "./utils/typeChecking.js";

const USER_ID = process.env.USER_ID;

export const createReplyKeyboardLayout = (buttonsList, cols = 1, ) => {
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
};

export const createReplyButtonsArr = (...buttonsList) => {
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
};

export const handleGroupDataFetching = async (chatId) => {
  try {
    var groupId = await fetchUserGroupId(USER_ID);
    var data = await fetchDataOnGroup(groupId);
    return data;
  } catch (err) {
    // Bugsnag.notify(err);
    throw err;
  }
};

export const handleTimeCommand = async (chatId, unixTime) => {
  try {
    const groupData = await handleGroupDataFetching(chatId);
    const { studySchedules, timeZoneOffsetSec } = groupData;
    if (!isObject(studySchedules)) {
      sendMessage(chatId, BOT_MESSAGES.studyScheduleNotFound);
      return;
    }

    const localUnixTime = unixTime + timeZoneOffsetSec;
    const localTime = getLocalTime(localUnixTime);

    const thisWeekdaySchedule = filterThisWeekdayStudySchedule(studySchedules, localTime);
    const timeInfo = getStudyTimeInfo(localUnixTime, thisWeekdaySchedule);
    console.log(thisWeekdaySchedule);
    const processedTimeInfo = processTimeInfo(timeInfo);
    await sendMessage(chatId, processedTimeInfo);
  } catch (err) {
    errorHandler(err, "handleTimeCommand", "commandHandling.js");
    return;
  }
};

export async function handleCommand(chatId, command, unixTime) {
  try {
    if (command.startsWith("/")) {
      command = command.slice(1).toLowerCase();
    }
    console.log("handle command")
    switch (command) {
      case COMMANDS.custom.back:
      case COMMANDS.default.start: {
        
        const COLS = 2;
        const buttons = [COMMANDS.custom.retrieveHomework, COMMANDS.custom.uploadHomework, COMMANDS.custom.schedule, COMMANDS.custom.time, COMMANDS.custom.settings];
        const keyboard = createReplyKeyboardLayout(buttons, COLS);
        const params = {
          reply_markup: {
            keyboard,
            is_persistent: false,
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        };

        if (command === COMMANDS.custom.back) {
          await sendMessage(chatId, "Отлично!", params);
          return;
        }
        
        await sendMessage(chatId, BOT_MESSAGES.introText, params);
        await sendStartMenu(chatId)
        return;
      }
      case COMMANDS.custom.settings: {
        const buttons = [COMMANDS.custom.setTime,COMMANDS.custom.setSchedule, COMMANDS.custom.back];
        const keyboard = createReplyKeyboardLayout(buttons);
        const params = {
          reply_markup: {
            keyboard,
            is_persistent: false,
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        };

        await sendMessage(chatId, MENU_TEXT.settings, params);
        return;
      }        
      case COMMANDS.custom.schedule:
      case COMMANDS.custom.setTime:
        sendMessage(chatId, BOT_MESSAGES.unsupported);
        return;
      case COMMANDS.custom.time:
        handleTimeCommand(chatId, unixTime);
        return;

      default:
        await sendMessage(chatId, BOT_MESSAGES.unknownCommand);
        return;
    }
  } catch (error) {
    errorHandler(error, "handleCommand", "commandHandling.js");
    return;
  }
}
