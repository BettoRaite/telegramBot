const { WEEKDAYS_RU, SEC_IN_MS, SEC_IN_DAY, DAYS_PER_WEEK } = require("./constants");
const { errorHandler } = require("./helpers");

function getLocalUnixTimestamp(timeZoneDiffSec = 0, unixTimestamp) {
  if (!Number.isFinite(timeZoneDiffSec) || !Number.isFinite(unixTimestamp)) {
    errorHandler(
      "timeZoneDiffSec and unixTimestamp expected to be of type number",
      "getLocalUnixTimestamp",
      "date"
    );
    return null;
  }
  const localUnixTimestamp = unixTimestamp + timeZoneDiffSec;
  return localUnixTimestamp;
}
function getDate(unixTimestamp, dateString = "") {
  if (!Number.isFinite(unixTimestamp)) {
    errorHandler("unixTimestamp expected to be of type number", "getDate", "date");
    return null;
  }

  const OFFSET = 1;
  const CONV_FACTOR = 1000;

  const timestamp = unixTimestamp * CONV_FACTOR;
  let date = {};
  if (dateString) {
    date = new Date(dateString);
  } else {
    date = new Date(timestamp);
  }

  const day = Number(date.getUTCDate());
  const month = Number(date.getUTCMonth()) + OFFSET;
  const year = Number(date.getUTCFullYear());
  const weekday = Number(date.getUTCDay());

  const MIN_VAL = 10;
  const time = {
    day,
    month: month,
    year,
    weekday: WEEKDAYS_RU[weekday],
    strDate: `${year}-${month < MIN_VAL ? "0" + month : month}-${day < MIN_VAL ? "0" + day : day}`,
    reversedStrDate: `${day < MIN_VAL ? "0" + day : day}-${
      month < MIN_VAL ? "0" + month : month
    }-${year}`,
  };
  return time;
}
function getDateUTC5(unixTimestamp) {
  const timeZoneDiffsec = 5 * 3600;
  return getDate(getLocalUnixTimestamp(timeZoneDiffsec, unixTimestamp));
}
function calculateDateDiff(currentDate, docDate) {
  if (!(currentDate instanceof Date) || !(docDate instanceof Date)) {
    errorHandler(new TypeError("Date object is expected"), "calculateDateDiff", "date.js");
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

module.exports = {
  getDate,
  getLocalUnixTimestamp,
  getDateUTC5,
  calculateDateDiff,
};
