import { TIME } from "./constants.js";
import errorHandler from "./helpers.js";
import { parseTimeZone } from "./dataProcessing.js";
import { isObject } from "./utils/typeChecking.js";
import { parseTime } from "./dataProcessing.js";

export const getLocalTime = (localUnixTime) => {
  if (!Number.isFinite(localUnixTime)) {
    errorHandler("localUnixTime is expected to be a number", "getLocalTime", "time.js");
    return null;
  }
  const timestamp = localUnixTime * TIME.sec_to_ms;
  const localTime = new Date(timestamp);
  return localTime;
};
export const getTimeFromUnixTime = (unixTime) => {
  if (!Number.isFinite(unixTime)) {
    errorHandler(
      `localUnixTime is expected to be a number instead got this ${unixTime}`,
      "getTimeFromUnixTime",
      "time.js"
    );
    return null;
  }
  const timestamp = unixTime * TIME.sec_to_ms;
  const time = new Date(timestamp);
  return time;
};

export const calculateDateDiff = (currentDate, docDate) => {
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
};

export const getSecSinceDayBegin = (unixTime) => {
  if (!Number.isFinite(unixTime)) {
    throw new TypeError(`unixTime was expected to be a number instead got this ${unixTime}`);
  }
  const timestamp = unixTime * TIME.sec_to_ms;
  const date = new Date(timestamp); // we set the date to the timestamp which the local time
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const timeElapsed = hours * TIME.hours_to_sec + minutes * TIME.min_to_sec;
  return timeElapsed;
};

export const timeDiffWithinInterval = (timeSec, startInterval, endInterval) => {
  if (
    !Number.isFinite(timeSec) ||
    !Number.isFinite(startInterval) ||
    !Number.isFinite(endInterval)
  ) {
    throw new SyntaxError(
      `timeSec, startInterval, endInterval were expected to be a number instead got this timeSec: ${timeSec}, startInterval: ${startInterval}, endInterval: ${endInterval}`
    );
  }
  if (timeSec < startInterval) {
    return -1;
  } else if (timeSec > endInterval) {
    return 1;
  }

  const diff = endInterval - timeSec;
  const hours = Math.floor(diff / TIME.hours_to_sec);
  const minutes = Math.round((diff % TIME.hours_to_sec) / TIME.min_to_sec);

  return {
    hours,
    minutes,
  };
};

/**
 * Checks if a study session duration in seconds is more or equal to the specified duration.
 * @param {number} studySessionDurationSec - An expected duration of one study session in seconds.
 * @param {number} startTimeSec - Start time of a study session in seconds.
 * @param {number} endTimeSec - End time of a study session in seconds.
 * @returns {boolean} Returns true if the study session meets or exceeds the expected duration, otherwise false.
 */
export const isStudySession = (studySessionDurationSec, startTimeSec, endTimeSec) => {
  if (!Number.isFinite(studySessionDurationSec)) {
    throw new TypeError(
      `studySessionDurationSec was expected to be a number instead got this ${studySessionDurationSec}`
    );
  } else if (!Number.isFinite(startTimeSec)) {
    throw new TypeError(
      `startTimeSec was expected to be a number instead got this ${startTimeSec}`
    );
  } else if (!Number.isFinite(endTimeSec)) {
    throw new TypeError(`endTimeSec was expected to be a number instead got this ${endTimeSec}`);
  }

  const durationSec = endTimeSec - startTimeSec;

  if (durationSec >= studySessionDurationSec) {
    return true;
  }

  return false;
};

export const timeDiffWithinStudySession = (timeSeconds, studySchedule, studySessionDurationSec) => {
  if (!Number.isFinite(timeSeconds)) {
    throw new SyntaxError(
      `timeSeconds was expected to be a number instead got this ${timeSeconds}`
    );
  } else if (!Array.isArray(studySchedule)) {
    throw new SyntaxError(
      `studySchedule was expected to be an array instead got this ${studySchedule}`
    );
  } else if (!Number.isFinite(studySessionDurationSec)) {
    throw new SyntaxError(
      `studySessionDurationSec was expected to be a number instead got this ${studySessionDurationSec}`
    );
  }

  for (const studySession of studySchedule) {
    const startTime = parseTime(studySession[0]);
    const endTime = parseTime(studySession.at(-1));
    const timeDiff = timeDiffWithinInterval(timeSeconds, startTime, endTime);

    if (isObject(timeDiff)) {
      console.log(
        studySessionDurationSec,
        endTime - startTime,
        studySession[0],
        studySession.at(-1)
      );
      if (!isStudySession(studySessionDurationSec, startTime, endTime)) {
        break;
      }
      return timeDiff;
    }
  }
  return {
    hours: 0,
    minutes: 0,
  };
};

export const calcStudySessionTime = (lessonMin = 45, breakMin = 0) => {
  return 2 * lessonMin * TIME.min_to_sec + breakMin * TIME.min_to_sec;
};

/**
 * Calculates the difference between a given local time and multiple lesson intervals.
 * Each lesson interval is defined by a start and end time string.
 *
 * @param {number} timeSeconds Local time in seconds since the beginning of the day.
 * @param {...string} lessonsIntervals Pairs of strings representing the start and end times of lessons.
 *                                       Times should be in the format 'HH:MM' (24-hour clock).
 * @returns {Object} An object with 'hours' and 'minutes' representing the time difference
 *                   if `timeSec` falls within one of the provided intervals. If `timeSec`
 *                   is not within any intervals, returns an object with 'hours' and 'minutes'
 *                   set to 0.
 * @throws {TypeError} If `timeSec` is not a finite number, or if  any of the strings representing the start and end times, aren't a string time.
 *
 * @example
 * // If the current time is 10:15 AM, represented as 36900 seconds
 * // and there's a lesson from 10:00 AM to 11:00 AM
 * timeDiffWithinLesson(36900, '10:00', '11:00');
 * // returns { hours: 0, minutes: 15 }
 */
export const timeDiffWithinLesson = (timeSeconds, ...lessonsIntervals) => {
  if (!Number.isFinite(timeSeconds)) {
    throw new TypeError(`timeSeconds was expected to be a number instead got this ${timeSeconds}`);
  }
  const PAIR_INTERVAL = 2;

  for (let i = 0; i < lessonsIntervals.length; i += PAIR_INTERVAL) {
    const startTime = parseTime(lessonsIntervals[i]);
    const endTime = parseTime(lessonsIntervals[i + 1]);
    const timeDiff = timeDiffWithinInterval(timeSeconds, startTime, endTime);
    if (isObject(timeDiff)) {
      return timeDiff;
    }
  }
  return {
    hours: 0,
    minutes: 0,
  };
};
/**
 * Calculates the time difference between the current time and study day, study session, lesson end times,
 * if the current time falls within the given intervals range inclusive.
 *
 * @param {number} unixTime Time in seconds since 01.01.1970 00:00:00.
 * @param {Array} studySchedule A 2D array where each subarray represents a study session.
 * A study session is composed of lessons, which are just pairs of start and end times.
 * The times are represented in the format 'HH:MM' (24-hour clock).
 * @param {number} studySessionDurationSec Duration in seconds of one study session.
 * @returns {Array} If time in seconds since the beginning of the day is less than the
 * first study session start time should return an array with -1 ~[-1] (indicating the time is before study day start).
 * Otherwise if time is after study session end time should return an array with 1 ~[1] (indicating the time is after study day end).
 * If the time is within study day inclusive should return an array with three objects with props hours, minutes.
 * @throws {SyntaxError} If `unixTime` is not a finite number, if `studySchedule` is not an array, if `studySessionDurationSec` is not a finite number, if flattened `studySchedule` is not of even length.
 */
export function getStudyTimeInfo(
  unixTime,
  studySchedule,
  studySessionDurationSec = calcStudySessionTime()
) {
  if (!Number.isFinite(unixTime)) {
    throw new SyntaxError(`unixTime was expected to be a number instead got this ${unixTime}`);
  } else if (!Array.isArray(studySchedule)) {
    throw new SyntaxError(
      `studySchedule was expected to be an array instead got this ${studySchedule}`
    );
  } else if (!Number.isFinite(studySessionDurationSec)) {
    throw new SyntaxError(
      `studySessionDurationSec was expected to be a number instead got this ${studySessionTime}`
    );
  }

  const flatStudySchedule = studySchedule.flat(Infinity);
  if (flatStudySchedule.length === 0) {
    return [0];
  } else if (flatStudySchedule.length / 2 == 0) {
    throw new SyntaxError("study schedule is expected to be of even length");
  }

  const secSinceDayBegin = getSecSinceDayBegin(unixTime);

  const startTimeSec = parseTime(flatStudySchedule[0]);
  const endTimeSec = parseTime(flatStudySchedule.at(-1));

  const timeUntilStudyDayEnd = timeDiffWithinInterval(secSinceDayBegin, startTimeSec, endTimeSec);
  const beforeStudyDayStart = -1;
  const afterStudyDayEnd = 1;

  if (timeUntilStudyDayEnd === beforeStudyDayStart) {
    return [beforeStudyDayStart];
  } else if (timeUntilStudyDayEnd === afterStudyDayEnd) {
    return [afterStudyDayEnd];
  }

  const timeUntilStudySessionEnd = timeDiffWithinStudySession(
    secSinceDayBegin,
    studySchedule,
    studySessionDurationSec
  );
  const timeUntilLessonEnd = timeDiffWithinLesson(secSinceDayBegin, ...flatStudySchedule);

  return [timeUntilStudyDayEnd, timeUntilStudySessionEnd, timeUntilLessonEnd];
}
