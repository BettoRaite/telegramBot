// MESSAGE NAMES
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
];
// ACTION NAMES
const UPLOAD_ACTION = "upload-homework";
const GET_ACTION = "get-homework";

const INTRODUCTION_TEXT = `こ日は или же 'Привет' на твоём языке 😁

Меня зовут Соня 😇
Я универсальный помощник учебной группы

📩 Отправь мне свое домашнее задание и я его надёжно　сохраню ✅ 
А когда тебе нужна будет сохраненная домашка, просто попроси меня! 👌

Внизу ты можешь выбрать одно из опций!
`;
const MAIN_MENU_TEXT = "Выберите одно из опций";
const HOMEWORK_UPLOAD_MESSAGE = "Впишите домашнее задание";
const UPLOAD_SUCCESS_MESSAGE = "Отлично!";
const CANCEL_OPERATION_SUCCESS_MESSAGE = "Операция была отменена";
const CANCEL_OPERATION_ERROR_MESSAGE = "Походу тут нечего отменять";
const ERROR_DOC_UPLOAD = "К сожалению загрузка документов не поддерживается на данный момент";

module.exports = {
  SUBJECT_NAMES,
  INTRODUCTION_TEXT,
  UPLOAD_ACTION,
  GET_ACTION,
  HOMEWORK_UPLOAD_MESSAGE,
  UPLOAD_SUCCESS_MESSAGE,
  MAIN_MENU_TEXT,
  CANCEL_OPERATION_SUCCESS_MESSAGE,
  CANCEL_OPERATION_ERROR_MESSAGE,
  ERROR_DOC_UPLOAD,
};
