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
// PREFIXES
const TEXT_DATA_PREFIX = "text";
const IMAGE_DATA_PREFIX = "image";
const CAPTION_DATA_PREFIX = "caption";
// DATE
const SEC_IN_MS = 1000;
const SEC_IN_DAY = 86400;
const DAYS_PER_WEEK = 7;
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
};
