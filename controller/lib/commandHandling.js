import errorHandler from './helpers.js';
import {sendMessage,
  sendStartMenu,
  sendSubjectsOptionMenu,
  sendMainReplyMenu} from './send.js';
import {fetchUserGroupId, fetchDataOnGroup} from './firebase.js';
import {getStudyTimeInfo, getLocalTime} from './time.js';
import {
  filterThisWeekdayStudySchedule, processTimeInfo,
} from './dataProcessing.js';
import {COMMANDS, BOT_MESSAGES, MENU_TEXT, ACTIONS} from './constants.js';
import {isObject} from './utils/typeChecking.js';
import {setAction, deleteUserAfter, getUser} from './utils/user.js';
// eslint-disable-next-line no-undef
const USER_ID = process.env.USER_ID;

export const createReplyKeyboardLayout = (buttonsList, cols = 1 ) => {
  if (!Array.isArray(buttonsList)) {
    errorHandler(
        'buttonsList is expected to be an array',
        'createReplyKeyboardLayout',
        'telegram.js',
    );
    return null;
  } else if (!Number.isFinite(cols) || !Number.isInteger(cols)) {
    errorHandler(
        'cols is expected to be an integer',
        'createReplyKeyboardLayout',
        'telegram.js');
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
    layout.push(createReplyButtonsArr(...slicedButtonsList));
  }
  return layout;
};

export const createReplyButtonsArr = (...buttonsList) => {
  const replyButtonsArr = [];
  // iterating through commands list *DDN*
  for (const btnName of buttonsList) {
    // checking if command is a string *DDN*
    if (typeof btnName !== 'string') {
      errorHandler(
          `btnName is expected to be of type string,
          instead got ${buttonsList}`,
          'createReplyButtonsArr',
          'telegram.js',
      );
      return [];
    }
    // creating a reply button with the command name as text *DDN*
    const replyButton = {text: btnName};
    replyButtonsArr.push(replyButton);
  }

  return replyButtonsArr;
};

export const handleGroupDataFetching = async (chatId) => {
  try {
    const groupId = await fetchUserGroupId(USER_ID);
    const data = await fetchDataOnGroup(groupId);
    return data;
  } catch (err) {
    // Bugsnag.notify(err);
    throw err;
  }
};

export const handleTimeCommand = async (userId, unixTime) => {
  try {
    const groupData = await handleGroupDataFetching(userId);
    const {studySchedules, timeZoneOffsetSec} = groupData;
    if (!isObject(studySchedules)) {
      sendMessage(userId, BOT_MESSAGES.studyScheduleNotFound);
      return;
    }

    const localUnixTime = unixTime + timeZoneOffsetSec;
    const localTime = getLocalTime(localUnixTime);

    const thisWeekdaySchedule = filterThisWeekdayStudySchedule(
        studySchedules,
        localTime);
    const timeInfo = getStudyTimeInfo(localUnixTime, thisWeekdaySchedule);
    console.log(thisWeekdaySchedule);
    const processedTimeInfo = processTimeInfo(timeInfo);
    await sendMessage(userId, processedTimeInfo);
  } catch (err) {
    errorHandler(err, 'handleTimeCommand', 'commandHandling.js');
    return;
  }
};

export const handleActionSetting = (userId, action)=> {
  const resetTimeSec = 5 * 60;
  // Setting action for the user *DDN*
  setAction(userId, action);
  // Deleting user after 5 min of inactivity *DDN*
  deleteUserAfter(userId, resetTimeSec);
  // Sending menu with subjects *DDN*
  sendSubjectsOptionMenu(userId);
  console.log(`action: ${action} was set.`);

  return COMMANDS.custom.retrieveHomework;
};
/**
 *
 * @param {string} userId Telegram id of a user.
 * @param {string} command A string command.
 * @param {number} unixTime UTC number of seconds
 * representing the time when a user sent the command.
 * @return {string} if a passed in `command` exists
 * should return the `command` back, if it doesn't
 * should return an empty string and
 * send the telegram user an appropriate message.
 */
export async function handleCommand(userId, command, unixTime) {
  try {
    if (command.startsWith('/')) {
      command = command.slice(1).toLowerCase();
    }
    console.log('handle command');
    switch (command) {
      case COMMANDS.custom.back:
      case COMMANDS.default.start: {
        if (command === COMMANDS.custom.back) {
          await sendMainReplyMenu(userId, 'ок');
          return;
        }
        await sendMainReplyMenu(userId, BOT_MESSAGES.introText);
        await sendStartMenu(userId);
        return;
      }
      case COMMANDS.custom.settings: {
        const buttons = [
          COMMANDS.custom.setTime,
          COMMANDS.custom.setSchedule,
          COMMANDS.custom.back,
        ];
        const keyboard = createReplyKeyboardLayout(buttons);
        const params = {
          reply_markup: {
            keyboard,
            is_persistent: false,
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        };

        await sendMessage(userId, MENU_TEXT.settings, params);
        return;
      }
      case COMMANDS.custom.schedule:
      case COMMANDS.custom.setTime:
        sendMessage(userId, BOT_MESSAGES.unsupported);
        return;
      case COMMANDS.custom.time:
        handleTimeCommand(userId, unixTime);
        return;
      case COMMANDS.custom.retrieveHomework:
        handleActionSetting(userId, ACTIONS.retrieveHomework);
        console.log(getUser(userId));
        return;
      case COMMANDS.custom.uploadHomework:
        handleActionSetting(userId, ACTIONS.uploadHomework);
        console.log(getUser(userId));
        return;
      default:
        await sendMessage(userId, BOT_MESSAGES.unknownCommand);
        return;
    }
  } catch (error) {
    errorHandler(error, 'handleCommand', 'commandHandling.js');
    return;
  }
}
