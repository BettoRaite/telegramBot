const COLLECTION_NAME = "subjects";
// SUBJECT NAMES
const SUBJECT_NAMES = [
  "математика",
  "русский",
  "история",
  "физика",
  "химия",
  "география",
  "биология",
  "обж",
  "информатика",
  "литература",
  "английский язык",
  "расписание",
];
const WEEKDAYS_RU = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];
// ACTION NAMES
const UPLOAD_ACTION = "upload-homework";
const GET_ACTION = "get-homework";
const SET_TIME_ACTION = "set-time";
// PREFIXES
const TEXT_DATA_PREFIX = "text";
const IMAGE_DATA_PREFIX = "image";
const CAPTION_DATA_PREFIX = "caption";
// DATE
const SEC_IN_MS = 1000;
const SEC_IN_DAY = 86400;
const DAYS_PER_WEEK = 7;
// COMMANDS
const SCHEDULE_COMMAND = "🗒 Расписание";
const TIME_COMMAND = "⏱ Время";
const SETTINGS_COMMAND = "⚙️ Настройки";
const SET_TIME_COMMAND = "🔔 Звонки";
const BACK_COMMAND = "🔙Обратно";
const MAIN_COMMANDS_LIST = [SCHEDULE_COMMAND, TIME_COMMAND, SETTINGS_COMMAND, SET_TIME_COMMAND];
const ALL_COMMANDS_LIST = [...MAIN_COMMANDS_LIST, BACK_COMMAND];

module.exports = {
  SUBJECT_NAMES,
  UPLOAD_ACTION,
  GET_ACTION,
  IMAGE_DATA_PREFIX,
  TEXT_DATA_PREFIX,
  COLLECTION_NAME,
  CAPTION_DATA_PREFIX,
  WEEKDAYS_RU,
  SEC_IN_MS,
  SEC_IN_DAY,
  DAYS_PER_WEEK,
  SCHEDULE_COMMAND,
  TIME_COMMAND,
  MAIN_COMMANDS_LIST,
  ALL_COMMANDS_LIST,
  SET_TIME_COMMAND,
  BACK_COMMAND,
  SET_TIME_ACTION,
};
