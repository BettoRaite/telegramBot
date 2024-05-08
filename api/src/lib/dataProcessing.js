import {TIME} from './constants.js';
import {isObject} from './utils/typeChecking.js';
import {BOT_MESSAGES} from './constants.js';
export function filterThisWeekdayStudySchedule(studySchedules, localTime) {
  if (!isObject(studySchedules)) {
    throw new TypeError(
        `studySchedules was expected to be an object, instead got this ${studySchedules}`,
    );
  } else if (!(localTime instanceof Date)) {
    throw new TypeError(
        `localTime was expected to be an instance of date, instead got this ${localTime}`,
    );
  }
  const defaultSchedule = 'default';

  const weekdayIndex = localTime.getUTCDay();
  const weekday = TIME.weekdays[weekdayIndex];
  const scheduleOnSpecificDay = studySchedules[weekday];

  let studySchedule = '';

  if (typeof scheduleOnSpecificDay === 'string') {
    studySchedule = JSON.parse(scheduleOnSpecificDay);
  } else {
    studySchedule = JSON.parse(studySchedules[defaultSchedule]);
  }

  if (Array.isArray(studySchedule)) {
    return studySchedule;
  } else {
    throw new TypeError(
        `studySchedule was expected to be an array instead got this ${studySchedule}`,
    );
  }
}

export function parseTimeZone(timeZone) {
  if (typeof timeZone !== 'string') {
    // Default value of timeZone when creating a group should always be "00:00"
    // If user sets the time zone it should always be handled correctly, resulting in time zone of format 'hh:mm'
    throw new TypeError(`timeZone is expected to be a string instead got this: ${timeZone}`);
  }
  let hasMinus = false;
  if (timeZone.startsWith('-')) {
    hasMinus = true;
    timeZone = timeZone.slice(1);
  }
  const SEPARATOR = ':';
  const [hoursStr, minutesStr] = timeZone.split(SEPARATOR);
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new SyntaxError(
        `timeZone is expected to be in the format 'hh:mm' instead got this: ${timeZone}`,
    );
  }
  if (hours < 0 || hours >= TIME.hoursPerDay) {
    throw new SyntaxError(
        `hours difference is out of bounds, timeZone - (${hasMinus ? '-' : ''}${timeZone})`,
    );
  }
  if (minutes < 0 || minutes >= TIME.min_per_hourur) {
    throw new SyntaxError(`minutes difference is out of bounds, timeZone - (${timeZone})`);
  }
  const offset = hours * TIME.hoursToSeconds + minutes * TIME.minutesToSeconds;
  if (hasMinus) {
    return -offset;
  } else {
    return offset;
  }
}


export function parseTime(timeStr) {
  if (typeof timeStr !== 'string') {
    throw new TypeError(`timeStr is expected to be a string instead got this: ${timeStr}`);
  }
  let hasMinus = false;
  if (timeStr.startsWith('-')) {
    hasMinus = true;
    timeStr = timeStr.slice(1);
  }
  const SEPARATOR = ':';
  const [hoursStr, minutesStr] = timeStr.split(SEPARATOR);
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new SyntaxError(`time is expected to be in the format 'hh:mm' instead got this: ${timeStr}`);
  } else if (hours > TIME.hoursPerDay || minutes < 0 || minutes >= TIME.minutesPerHour) {
    throw new SyntaxError(
        `timeStr is out of bounds, timeStr - (${
        hasMinus ? '-' : ''
        }${timeStr}). Hours must be <= +-24, minutes must be >= 0 and <= 59`,
    );
  }
  const parsedTime = hours * TIME.hoursToSeconds + minutes * TIME.minutesToSeconds;

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

  let messages = '';

  switch (timeOnStudyDay) {
    case -1:
      return BOT_MESSAGES.studyDayNotStarted;
    case 1:
      return BOT_MESSAGES.studyDayFinished;
    case 0:
      return BOT_MESSAGES.todayIsOffDay;
  }

  isBreak = false;

  const hoursSession = timeOnStudySession?.hours;
  const minutesSession = timeOnStudySession?.minutes;

  if (
    (hoursSession > 0 || minutesSession > 0) &&
    Number.isFinite(hoursSession) &&
    Number.isFinite(minutesSession)
  ) {
    messages += `${BOT_MESSAGES.untilStudySessionEnd} ${hoursSession}ч ${minutesSession}м \n\n`;
  }

  const hoursLesson = timeOnLesson?.hours;
  const minutesLesson = timeOnLesson?.minutes;

  if (
    (hoursLesson > 0 || minutesLesson > 0) &&
    Number.isFinite(hoursLesson) &&
    Number.isFinite(minutesLesson)
  ) {
    messages += `${BOT_MESSAGES.untilLessonEnd} ${hoursLesson}ч ${minutesLesson}м \n\n`;
  } else {
    isBreak = true;
  }

  const hours = timeOnStudyDay?.hours;
  const minutes = timeOnStudyDay?.minutes;
  if ((hours > 0 || minutes > 0) && Number.isFinite(hours) && Number.isFinite(minutes)) {
    const mainPart =
      BOT_MESSAGES.timeInfoHeader + `${BOT_MESSAGES.untilStudyDayEnd} ${hours}ч ${minutes}м \n\n`;

    if (isBreak) {
      return mainPart + BOT_MESSAGES.breakTime;
    }
    return mainPart + messages;
  }
};
