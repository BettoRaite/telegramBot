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
  secondsToMs: 1000,
  minutesToSeconds: 60,
  hoursToSeconds: 3600,
  dayToSec: 24 * 3600,
  weekdays: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  hoursPerDay: 24,
  minutesPerHour: 60,
};

export const FIREBASE_COLLECTIONS = {
  users: "users",
  groups: "groups",
};
export const BOT_MESSAGES = {
  unknownCommand: "😵‍💫 Данная комманда не существует.",
  introText: `Привет, ну что узнаем время на сегодня? 🤓`,
  badCommand: `😵‍💫 Кажись, вы немного перепутали команды... ✍️ Попробуйте ещё раз.
  
👉 либо нажмите на /main чтобы вернутся в главное меню`,
  badMessage: `😞 К сожалению, я только понимаю определенные команды)
  
👉 Как насчет, вы мне подарите свой мозг и я наконец-то захвачу этот мир? 😏
        `,
  success: "✅ Готово",
  fatalError: "❌ Возникла неприятная ошибка! Мы уже в процессе! Держитесь 🧐",
  unsupported: "Упс...пока что данная функция не поддерживается ⬇️",
  studyScheduleNotFound: `Кажись, админ группы не установил расписание звонков. KILL 'IM!`,
  studyDayNotStarted: `😺 Занятия пока-что ещё не начались.`,
  studyDayFinished: `Можно наконец-токи вздохнуть 😌 
Занятия кончились ❇️`,
  timeInfoHeader: `🗒 Часов и минут до конца:\n\n`,
  untilStudyDayEnd: `⏳ Учебного дня:`,
  untilStudySessionEnd: `⏳ Пары:`,
  untilLessonEnd: `⏳ Урока:`,
  breakTime: "Перемена!",
  todayIsOffDay: `Ура! Сегодня Выходной! 🥳`,
  exceededUnresponseTime: "Печально, но вы ничего не написали 🫠",
};
