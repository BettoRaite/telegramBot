export const COLLECTION_NAME = "subjects";
// SUBJECT NAMES
export const SUBJECT_NAMES = [
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
export const WEEKDAYS_RU = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

// ACTION NAMES
export const UPLOAD_ACTION = "upload-homework";
export const GET_ACTION = "get-homework";
export const SET_TIME_ACTION = "set-time";
export const TEXT_DATA_PREFIX = "text";
export const IMAGE_DATA_PREFIX = "image";
export const CAPTION_DATA_PREFIX = "caption";
export const SCHEDULE_COMMAND = "🗒 Расписание";
export const TIME_COMMAND = "⏱ Время";
export const SETTINGS_COMMAND = "⚙️ Настройки";
export const SET_TIME_COMMAND = "🔔 Звонки";
export const BACK_COMMAND = "🔙Обратно";
export const MAIN_COMMANDS_LIST = [
  SCHEDULE_COMMAND,
  TIME_COMMAND,
  SETTINGS_COMMAND,
  SET_TIME_COMMAND,
];
export const ALL_COMMANDS_LIST = [...MAIN_COMMANDS_LIST, BACK_COMMAND];
export const SEC_IN_MS = 1000;
export const SEC_IN_DAY = 86400;
export const DAYS_PER_WEEK = 7;

export const TIME = {
  SEC_TO_MS: 1000,
  MIN_TO_SEC: 60,
  HOUR_TO_SEC: 3600,
  MIN_IN_HOUR: 24,
  WEEKDAYS: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
};
export const FIREBASE = {
  USERS_COLLECTION_NAME: "users",
  GROUPS_COLLECTION_NAME: "groups",
};
