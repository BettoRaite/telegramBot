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
	uploadHomework: "upload-homework",
	retrieveHomework: "retrieve-homework",
	setTime: "set-time",
};

export const BUTTON_TEXT = {
	uploadHomework: "Получить дз",
	retrieveHomework: "Загрузить дз",
	setTime: "Установить время",
};
export const MENU_TEXT = {
	main: "Выберите одну из опций",
	settings: "Тут вы можете настроить как душа ваша пожелает",
};

export const DATA_PREFIXES = {
	text: "text",
	image: "image",
	caption: "caption",
};

export const COMMANDS = {
	custom: {
		retrieveHomework: "📚 Получить дз",
		uploadHomework: "📝 Загрузить дз",
		settings: "⚙️ Настройки",
		time: "⏱ Время",
		setTime: "🔔 Настроить звонки",
		schedule: "🗒 Расписание",
		setSchedule: "🗒 Настроить расписание",
		back: "🔙Обратно",
	},
	default: {
		start: "start",
	},
};

export const TIME = {
	secondsToMs: 1000,
	minutesToSeconds: 60,
	hoursToSeconds: 3600,
	dayToSec: 24 * 3600,
	weekdays: [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	],
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
	badCommand: `
😵‍💫 Кажись, вы немного перепутали команды... ✍️ Попробуйте ещё раз.
  
👉 либо нажмите на /main чтобы вернутся в главное меню`,
	badMessage: `😞 К сожалению, я только понимаю определенные команды)
  
👉 Как насчет, вы мне подарите свой мозг и я наконец-то захвачу этот мир? 😏
        `,
	success: "✅ Готово",
	fatalError: "❌ Возникла неприятная ошибка! Мы уже в процессе! Держитесь 🧐",
	unsupported: "Упс...пока что данная функция не поддерживается ⬇️",
	studyScheduleNotFound: `
  Кажись, админ группы не установил расписание звонков. KILL 'IM!`,
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

export const DATA_TYPES = {
	number: "[Number]",
	string: "[String]",
	boolean: "[Boolean]",
	undefined: "[Undefined]",
	null: "[Null]",
	bigint: "[BigInt]",
	array: "[Array]",
	object: "[Object]",
	date: "[Date]",
	map: "[Map]",
	set: "[Set]",
};
