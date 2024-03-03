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

export const ACTIONS = {
  UPLOAD_ACTION: "upload-homework",
  GET_ACTION: "get-homework",
  SET_TIME_ACTION: "set-time",
};

export const DATA_PREFIXES = {
  text: "text",
  image: "image",
  caption: "caption",
};

export const COMMANDS = {
  schedule: "🗒 Расписание",
  time: "⏱ Время",
  settings: "⚙️ Настройки",
  setTime: "🔔 Звонки",
  back: "🔙Обратно",
  start: "start",
};

export const TIME = {
  sec_to_ms: 1000,
  min_to_sec: 60,
  hours_to_sec: 3600,
  day_to_sec: 24 * 3600,
  weekdays: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  hours_per_day: 24,
  min_per_hour: 60,
};

export const FIREBASE_COLLECTIONS = {
  users: "users",
  groups: "groups",
};
export const BOT_MESSAGES_LIST = {
  unknown_command: "😵‍💫 Данная комманда не существует.",
  intro_text: `Привет, ну что узнаем время на сегодня? 🤓`,
  bad_command: `😵‍💫 Кажись, вы немного перепутали команды... ✍️ Попробуйте ещё раз.
  
👉 либо нажмите на /main чтобы вернутся в главное меню`,
  bad_message: `😞 К сожалению, я только понимаю определенные команды)
  
👉 Как насчет, вы мне подарите свой мозг и я наконец-то захвачу этот мир? 😏
        `,
  success: "✅ Готово",
  fatal_error: "❌ Возникла неприятная ошибка! Прошу немедленно сообщить её разработчику! 🧐",
  unsupported: "Упс...пока что данная функция не поддерживается ⬇️",
  no_study_schedules: `Кажись, админ группы не установил расписание звонков. KILL 'IM!`,
  before_study_day: `😺 Занятия пока-что ещё не начались.`,
  after_study_day: `Можно наконец-токи вздохнуть 😌 
Занятия кончились ❇️`,
  time_info_main_body: `🗒 Часов и минут до конца:\n\n`,
  until_study_day_end: `⏳ Учебного дня:`,
  until_study_session_end: `⏳ Пары:`,
  until_lesson_end: `⏳ Урока:`,
  break_time: "Перемена!",
  off_day: `Ура! Сегодня Выходной! 🥳`,
};
