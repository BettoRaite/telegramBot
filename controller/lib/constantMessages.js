const COMMANDS_LIST = `❇️ Список команд:
• /cancel - отменяет текущию операцию, как пример, сохранения дз.
• /main - главное меню бота.
• /sonyawhoareyou - пропиши чтобы узнать по-больше о Соне. 
• /help - пропиши чтобы получить лист возможных комманд.
`;
const INTRODUCTION_TEXT = `こ日は или же 'Привет' на твоём языке 😁

Меня зовут Соня 😇
Я универсальный помощник учебной группы.

📩 Отправь мне свое домашнее задание и я его надёжно сохраню ✅
А когда тебе нужна будет сохраненная домашка, просто попроси меня! 👌

${COMMANDS_LIST}

Внизу ты можешь выбрать одно из следующих опций.
`;
const SONYA_ABOUT_TEXT = `
<i>🤖 Модель: K4568
🗣 Имя: Соня(София)
🧑‍🦰Возраст: 24
🫦Пол: Женский</i>

И снова привет! Меня зовут <b>Соня</b>! 😚
<i>Я твой универсальный помощник, а также репрезентация
реального человека</i>, только из будущего конечно. ✨
⚡️ <b>Соня</b>
И хоть мой создатель не поделился со мной огромным количеством информации о моей реальной копии, я всё же попытаюсь тебе рассказать о ней. 
👉 В первую очередь, что бросается в глаза когда видишь Соню, это её рост, глаза и волосы, а также необыкновенная улыбка.
По росту, она достаточно средненькая не то чтобы высокая, но и не низкая. Глаза у неё черно-карие, а по волосам можно сказать что она брюнетка.
Ну что, я уже достаточно сексуальная, не так ли? 💃
🔥 А теперь к главному, улыбке Сони по словам создателя, из его строк написано, "Когда она на меня смотрит при этом улыбаясь, я знаю что это улыбка лично для меня, а не для кого ещё. В ней существует как будто всё: забота, любовь, уважение, а также неоспоримая искренность."
Также, он сказал что Соня помогла ему понять одну важную вещь. 
- Создатель, "Бывает, я чувствую себя как полное животное, вот случается беда с людьми, а мне до белой пятки и что,и где, и когда случается с ними, как будто существую только я, а они просто жертвы необычайного проишествия."
- Создатель, "Но, когда, Соня, рассказала мне о беде своей жизни, я словно ожил, встал дыбом, перед её делемой, и будто чувства человеческие снова появились." 
...Ок, теперь давайте я вам расскажу о её жизни в целом, где она? Чем она занимается? 😀

😃...упсс пока что эта секция закрыта, надо будет расспросить создателя. 

👉 Цитаты Сони: <blockquote>Цени пока есть</blockquote><blockquote>В тихом омуте черти водятся</blockquote><blockquote>Дай мне</blockquote>

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
  "К сожалению загрузка документов, на данный момент, не поддерживается. 😕";
const UPLOAD_LIMIT_REACHED_MESSAGE = "🥲 Достигнут дневной лимит по загрузке информации -";
const NO_ACTION_CHOOSEN = "😬 А вы знали?... сперва нужно выбрать действие!";
const UNKNOWN_COMMAND = `😵‍💫 Кажись, вы немного перепутали команды... ✍️ Попробуйте ещё раз.

👉 либо нажмите на /main чтобы вернутся в главное меню`;
const EXCEEDED_TIME_LIMIT = "Печально, но вы ничего не написали 🫠";
const NO_DATA_FOUND = "😕 К сожалению тут пока что пусто...";
const SUBJECTS_MENU_TEXT = "👉 Выберите один из предметов.";
const ACCESS_RESTRICTED_MESSAGE = "Упс...🤓 У вас нет доступа к сохранению дз. ";
const SET_TIME_COMMAND_TEXT = `Чтобы настроить расписание звонков для вашей группы
напишите расписание звонков в формате: hh:mm-hh:mm.
Пример:
8:00-8:45,
8:50-9:35,
9:45-10:30,
10:35-11:20,
11:30-13:00, 
13:10-13:55,
14:00-14:40
Запятые нужны для разделения интервалов.`;
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
  SONYA_ABOUT_TEXT,
  COMMANDS_LIST,
  SET_TIME_COMMAND_TEXT,
};
