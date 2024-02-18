import { TIME } from "./constants.js";
import { WEEKDAYS_RU } from "./constants.js";
import errorHandler from "./helpers.js";
import { getUserTimezoneHours } from "./firebase.js";

export function getLocalUnixTimestamp(timeZoneDiffSec = 0, unixTimestamp) {
  if (!Number.isFinite(timeZoneDiffSec) || !Number.isFinite(unixTimestamp)) {
    errorHandler(
      "timeZoneDiffSec and unixTimestamp expected to be of type number",
      "getLocalUnixTimestamp",
      "time.js"
    );
    return null;
  }

  const localUnixTimestamp = unixTimestamp + timeZoneDiffSec;
  return localUnixTimestamp;
}

export function getDate(unixTimestamp, dateString = "") {
  if (!Number.isFinite(unixTimestamp)) {
    errorHandler("unixTimestamp expected to be of type number", "getDate", "time.js");
    return null;
  }

  const OFFSET = 1;
  const timestamp = unixTimestamp * TIME.SEC_TO_MS;
  let date = {};
  if (dateString) {
    date = new Date(dateString);
  } else {
    date = new Date(timestamp);
  }
  const day = Number(date.getUTCDate());
  const month = Number(date.getUTCMonth()) + OFFSET;
  const year = Number(date.getUTCFullYear());
  const weekdayIndex = Number(date.getUTCDay());
  const ms = Number(date.getTime());
  const MIN_VAL = 10;
  const time = {
    unixTimestamp,
    dateObj: date,
    ms,
    day,
    month: month,
    year,
    weekday: WEEKDAYS_RU[weekdayIndex],
    weekdays_eng: TIME.WEEKDAYS[weekdayIndex],
    strDate: `${year}-${month < MIN_VAL ? "0" + month : month}-${day < MIN_VAL ? "0" + day : day}`,
    reversedStrDate: `${day < MIN_VAL ? "0" + day : day}-${
      month < MIN_VAL ? "0" + month : month
    }-${year}`,
  };
  return time;
}
export function getDateUTC5(unixTimestamp) {
  const timeZoneDiffsec = 5 * 3600;
  return getDate(getLocalUnixTimestamp(timeZoneDiffsec, unixTimestamp));
}
export function calculateDateDiff(currentDate, docDate) {
  if (!(currentDate instanceof Date) || !(docDate instanceof Date)) {
    errorHandler(new TypeError("Date object is expected"), "calculateDateDiff", "time.js");
    return null;
  }

  // reseting time for the current date *DDN*
  // which is going to help me find monday start time *DDN*
  currentDate.setUTCHours(0, 0, 0, 0);
  // SETTING POINTS
  // getting the doc creation in sec *DDN*
  const docDateSec = docDate.getTime() / SEC_IN_MS;
  // getting the current date in sec *DDN*
  const currentDateSec = currentDate.getTime() / SEC_IN_MS;
  // getting days passed since monday *DDN*
  const daysSinceMonday = currentDate.getUTCDay();
  // this is a difference factor from monday to the current day *DDN*
  //                       0  1  2  3  4  5  6
  const WEEKDAY_INDEXES = [6, 0, 1, 2, 3, 4, 5];
  // current date in sec - sec in day * days passed since monday = monday in sec  *DDN*
  const mondayInSec = currentDateSec - SEC_IN_DAY * WEEKDAY_INDEXES[daysSinceMonday];
  // last week is essentially monday in sec - 7 days * sec in day which sets us to another point in time *DDN*
  const mondayLastWeek = mondayInSec - SEC_IN_DAY * DAYS_PER_WEEK;
  // comparing doc date in sec with checkpoints in time *DDN*
  if (docDateSec < mondayLastWeek) {
    return "давно";
  } else if (docDateSec < mondayInSec) {
    return `прошлая неделя ${WEEKDAYS_RU[docDate.getDay()]}`;
  }

  const diffSec = currentDateSec - docDateSec;
  // calculating the days passed between current date and doc date  *DDN*
  const daysDiff = Math.floor(diffSec / SEC_IN_DAY);

  switch (daysDiff) {
    case 0:
      return "сегодня";
    case 1:
      return "вчера";
    case 2:
      return "позавчера";
    default:
      return WEEKDAYS_RU[docDate.getDay()];
  }
}
export function calculateLocalUnixTimestamp(chatId, unixTimestamp) {
  if (typeof chatId !== "string") {
    errorHandler(
      "chatId is expected to be of type string",
      "calculateLocalUnixTimestamp",
      "time.js"
    );
    return null;
  }
  const hoursDiffFromUTC = getUserTimezoneHours(chatId);
  if (!Number.isFinite(hoursDiffFromUTC)) {
    errorHandler(
      "userTimezone is expected to be of type number",
      "calculateLocalUnixTimestamp",
      "time.js"
    );
    return null;
  }
  const secondsDiffFromUTC = hoursDiffFromUTC * 3600;
  const localUnixTimestamp = unixTimestamp + secondsDiffFromUTC;
  return localUnixTimestamp;
}

export function getStudyTimeInfo(localUnixTimestamp, timeIntervals) {
  if (!Array.isArray(timeIntervals)) {
    errorHandler("timeIntervals is expected to an array", "getStudyTimeInfo", "time.js");
    return null;
  }
  if (timeIntervals.length === 0) {
    return "Можно отдыхать)";
  }
  const timestamp = localUnixTimestamp * TIME.SEC_TO_MS;

  const localDate = new Date(timestamp);
  localDate.setUTCHours(0, 0, 0, 0);

  const dayStartUnixTimestamp = localDate.getTime() / TIME.SEC_TO_MS;
  const endTime = timeIntervals.at(-1).at(-1);
  const startTime = timeIntervals?.[0]?.[0];

  const studyDayTimeLeft = getTimeDiffBetween(
    dayStartUnixTimestamp,
    localUnixTimestamp,
    startTime,
    endTime
  );
  if (studyDayTimeLeft?.isAfterLessons) {
    return "Время отдыхать!";
  } else if (studyDayTimeLeft?.isBeforeLessons) {
    return "Ну вот, скоро новый день! Давайте попробуем улыбнуться!";
  }

  const lessonTimeLeft = getTimeInfoOnLesson(
    dayStartUnixTimestamp,
    localUnixTimestamp,
    timeIntervals
  );
  const hours = Math.floor(studyDayTimeLeft.hours);
  const minutes = Math.ceil(studyDayTimeLeft.minutes);
  return `
До конца учебного дня: ${hours}ч ${Math.ceil(minutes)}мин
До конца урока: ${lessonTimeLeft ? Math.ceil(lessonTimeLeft.minutes) + "мин" : "Перемена"} 
  `;
}
export function getTimeInfoOnLesson(dayStartUnixTimestamp, localUnixTimestamp, timeIntervals) {
  for (const [startTime, endTime] of timeIntervals) {
    const time = getTimeDiffBetween(dayStartUnixTimestamp, localUnixTimestamp, startTime, endTime);
    console.log(time);
    if (Object.prototype.toString.call(time) === "[object Object]" && !time.outOfBounds) {
      console.log(`${Math.floor(time.hours)}h ${Math.ceil(time.minutes)}min`);
      return time;
    }
  }
  return false;
}
export function getTimeDiffBetween(dayStartUnixTimestamp, localUnixTimestamp, startTime, endTime) {
  const [endTimeHours, endTimeMinutes] = endTime.split(":");
  const diffSecEndTime = endTimeHours * TIME.HOUR_TO_SEC + endTimeMinutes * TIME.MIN_TO_SEC;

  const endTimePoint = dayStartUnixTimestamp + diffSecEndTime;

  // defining endTimePoint
  const [startTimeHours, startTimeMinutes] = startTime.split(":");
  const diffSecStartTime = startTimeHours * TIME.HOUR_TO_SEC + startTimeMinutes * TIME.MIN_TO_SEC;
  const startTimePoint = dayStartUnixTimestamp + diffSecStartTime;
  // figuring out the diff
  const timePointsDiff = endTimePoint - localUnixTimestamp;

  if (startTimePoint <= localUnixTimestamp && localUnixTimestamp <= endTimePoint) {
    const hours = timePointsDiff / TIME.HOUR_TO_SEC;
    const minutes = (timePointsDiff % TIME.HOUR_TO_SEC) / TIME.MIN_TO_SEC;
    return {
      hours,
      minutes,
    };
  }
  return {
    outOfBounds: true,
    isBeforeLessons: localUnixTimestamp < startTimePoint,
    isAfterLessons: localUnixTimestamp > endTimePoint,
  };
}
