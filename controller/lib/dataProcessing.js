import { TIME } from "./constants.js";
import { isObject } from "./utils/typeChecking.js";
import { BOT_MESSAGES_LIST } from "./constants.js";
export function filterThisWeekdayStudySchedule(studySchedules, localTime) {
  if (!isObject(studySchedules)) {
    throw new TypeError(
      `studySchedules was expected to be an object, instead got this ${studySchedules}`
    );
  } else if (!(localTime instanceof Date)) {
    throw new TypeError(
      `localTime was expected to be an instance of date, instead got this ${localTime}`
    );
  }
  const defaultSchedule = "default";

  const weekdayIndex = localTime.getUTCDay();
  const weekday = TIME.weekdays[weekdayIndex];
  const scheduleOnSpecificDay = studySchedules[weekday];

  let studySchedule = "";

  if (typeof scheduleOnSpecificDay === "string") {
    studySchedule = JSON.parse(scheduleOnSpecificDay);
  } else {
    studySchedule = JSON.parse(studySchedules[defaultSchedule]);
  }

  if (Array.isArray(studySchedule)) {
    return studySchedule;
  } else {
    throw new TypeError(
      `studySchedule was expected to be an array instead got this ${studySchedule}`
    );
  }
}

export function parseTimeZone(timeZone) {
  if (typeof timeZone !== "string") {
    // Default value of timeZone when creating a group should always be "00:00"
    // If user sets the time zone it should always be handled correctly, resulting in time zone of format 'hh:mm'
    throw new TypeError(`timeZone is expected to be a string instead got this: ${timeZone}`);
  }
  let hasMinus = false;
  if (timeZone.startsWith("-")) {
    hasMinus = true;
    timeZone = timeZone.slice(1);
  }
  const SEPARATOR = ":";
  const [hoursStr, minutesStr] = timeZone.split(SEPARATOR);
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new SyntaxError(
      `timeZone is expected to be in the format 'hh:mm' instead got this: ${timeZone}`
    );
  }
  if (hours < 0 || hours >= TIME.hours_per_day) {
    throw new SyntaxError(
      `hours difference is out of bounds, timeZone - (${hasMinus ? "-" : ""}${timeZone})`
    );
  }
  if (minutes < 0 || minutes >= TIME.min_per_hour) {
    throw new SyntaxError(`minutes difference is out of bounds, timeZone - (${timeZone})`);
  }
  const offset = hours * TIME.hours_to_sec + minutes * TIME.min_to_sec;
  if (hasMinus) {
    return -offset;
  } else {
    return offset;
  }
}
export function parseTime(time) {
  if (typeof time !== "string") {
    throw new TypeError(`time is expected to be a string instead got this: ${time}`);
  }
  let hasMinus = false;
  if (time.startsWith("-")) {
    hasMinus = true;
    time = time.slice(1);
  }
  const SEPARATOR = ":";
  const [hoursStr, minutesStr] = time.split(SEPARATOR);
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new SyntaxError(`time is expected to be in the format 'hh:mm' instead got this: ${time}`);
  } else if (hours > TIME.hours_per_day || minutes < 0 || minutes >= TIME.min_per_hour) {
    throw new SyntaxError(
      `time is out of bounds, time - (${
        hasMinus ? "-" : ""
      }${time}). Hours must be <= +-24, minutes must be >= 0 and <= 59`
    );
  }
  const parsedTime = hours * TIME.hours_to_sec + minutes * TIME.min_to_sec;

  if (hasMinus) {
    return -parsedTime;
  } else {
    return parsedTime;
  }
}
export const processTimeInfo = (timeInfo) => {
  if (!Array.isArray(timeInfo)) {
    throw new TypeError(`timeInfo was expected to be an array instead got this ${timeInfo}`);
  }

  const timeOnStudyDay = timeInfo[0];
  const timeOnStudySession = timeInfo[1];
  const timeOnLesson = timeInfo[2];

  let isBreak = false;

  let messages = "";

  switch (timeOnStudyDay) {
    case -1:
      return BOT_MESSAGES_LIST.before_study_day;
    case 1:
      return BOT_MESSAGES_LIST.after_study_day;
    case 0:
      return BOT_MESSAGES_LIST.off_day;
  }

  isBreak = false;

  const hoursSession = timeOnStudySession?.hours;
  const minutesSession = timeOnStudySession?.minutes;

  if (
    (hoursSession > 0 || minutesSession > 0) &&
    Number.isFinite(hoursSession) &&
    Number.isFinite(minutesSession)
  ) {
    messages += `${BOT_MESSAGES_LIST.until_study_session_end} ${hoursSession}ч ${minutesSession}м \n\n`;
  }

  const hoursLesson = timeOnLesson?.hours;
  const minutesLesson = timeOnLesson?.minutes;

  if (
    (hoursLesson > 0 || minutesLesson > 0) &&
    Number.isFinite(hoursLesson) &&
    Number.isFinite(minutesLesson)
  ) {
    messages += `${BOT_MESSAGES_LIST.until_lesson_end} ${hoursLesson}ч ${minutesLesson}м \n\n`;
  } else {
    isBreak = true;
  }

  const hours = timeOnStudyDay?.hours;
  const minutes = timeOnStudyDay?.minutes;
  if ((hours > 0 || minutes > 0) && Number.isFinite(hours) && Number.isFinite(minutes)) {
    const mainPart =
      BOT_MESSAGES_LIST.time_info_main_body +
      `${BOT_MESSAGES_LIST.until_study_day_end} ${hours}ч ${minutes}м \n\n`;

    if (isBreak) {
      return mainPart + BOT_MESSAGES_LIST.break_time;
    }
    return mainPart + messages;
  }
};