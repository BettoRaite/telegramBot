const INTRODUCTION_TEXT = `こ日は или же 'Привет' на твоём языке 😁

Меня зовут Соня 😇
Я универсальный помощник учебной группы

📩 Отправь мне свое домашнее задание и я его надёжно сохраню ✅ 
А когда тебе нужна будет сохраненная домашка, просто попроси меня! 👌

Внизу ты можешь выбрать одно из опций!
`;
const INVALID_MESSAGE = `😞 К сожалению, я только понимаю определенные команды)

👉 Как насчет, вы мне подарите свой мозг и я наконец-то захвачу этот мир? 😏
        `;
const INVALID_UPLOAD_DATA = "❌ Брр...данный тип данных пока что не поддерживается ❌";
const MAIN_MENU_TEXT = "❇️ Список возможных опций";
const HOMEWORK_UPLOAD_MESSAGE =
  "👉 Вы можете скинуть свое домашнее задание в формате текста 📝, либо картинок 🌠.";
const UPLOAD_SUCCESS_MESSAGE = "✅ Готово";
const CANCEL_OPERATION_SUCCESS_MESSAGE = "🚫 Операция была отменена.";
const FATAL_ERROR_MESSAGE =
  "❌ Возникла неприятная ошибка! Прошу немедленно сообщить её разработчику! 🧐";
const CANCEL_OPERATION_ERROR_MESSAGE = "😃 Походу тут нечего отменять.";
const ERROR_DOC_UPLOAD_MESSAGE =
  "К сожалению загрузка документов не поддерживается на данный момент";
const UPLOAD_LIMIT_REACHED_MESSAGE = "🥲 Достигнут дневной лимит по загрузке информации -";
const NO_ACTION_CHOOSEN = "😬 УПС...а сперва нужно выбрать действие!";
const UNKNOWN_COMMAND = `😵‍💫 Кажись, вы немного перепутали команды... ✍️ Попробуйте ещё раз.

👉 либо нажмите на /main чтобы вернутся в главное меню`;
const EXCEEDED_TIME_LIMIT = "К сожалению, вы ничего не написали 🫠";
const NO_DATA_FOUND = "😕 К сожалению тут пока что пусто...";
const SUBJECTS_MENU_TEXT = "👉 Выберите один из предметов.";
const ACCESS_RESTRICTED_MESSAGE = "Упс...🤓 К сожалению, у вас нет доступа к сохранению дз. ";
// BUTTONS
const BTN_TEXT_GET_ACTION = "Получить дз";
const BTN_TEXT_UPLOAD_ACTION = "Сохранить дз";
// BUTTONS END

module.exports = {
  MAIN_MENU_TEXT,
  HOMEWORK_UPLOAD_MESSAGE,
  UPLOAD_SUCCESS_MESSAGE,
  CANCEL_OPERATION_SUCCESS_MESSAGE,
  FATAL_ERROR_MESSAGE,
  CANCEL_OPERATION_ERROR_MESSAGE,
  ERROR_DOC_UPLOAD_MESSAGE,
  UPLOAD_LIMIT_REACHED_MESSAGE,
  INVALID_MESSAGE,
  INTRODUCTION_TEXT,
  NO_ACTION_CHOOSEN,
  BTN_TEXT_GET_ACTION,
  BTN_TEXT_UPLOAD_ACTION,
  UNKNOWN_COMMAND,
  INVALID_UPLOAD_DATA,
  EXCEEDED_TIME_LIMIT,
  NO_DATA_FOUND,
  SUBJECTS_MENU_TEXT,
  ACCESS_RESTRICTED_MESSAGE,
};
