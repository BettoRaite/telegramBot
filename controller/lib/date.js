const { errorHandler } = require("./helpers");

function getLocalUnixTimestamp(timeZoneDiffSec = 0, unixTimestamp) {
  if (!Number.isFinite(timeZoneDiffSec) || !Number.isFinite(unixTimestamp)) {
    errorHandler(
      "timeZoneDiffSec and unixTimestamp expected to be of type number",
      "getTimestampRelativeTo",
      "date.js"
    );
    return null;
  }
  const localUnixTimestamp = unixTimestamp + timeZoneDiffSec;
  console.log(new Date(localUnixTimestamp * 1000));
  return localUnixTimestamp;
}
function getDate(unixTimestamp) {
  if (!Number.isFinite(unixTimestamp)) {
    errorHandler("unixTimestamp expected to be of type number", "getDate", "date.js");
    return null;
  }
  const CONV_FACTOR = 1000;
  const timestamp = unixTimestamp * CONV_FACTOR;

  const weekdaysRu = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  const OFFSET = 1;
  const date = new Date(timestamp);
  const day = Number(date.getDate());
  const month = Number(date.getMonth()) + OFFSET;
  const year = Number(date.getFullYear());
  const weekday = Number(date.getDay());
  const time = {
    day,
    month: month,
    year,
    weekday: weekdaysRu[weekday],
    strDate: `${day}-${month}-${year}`,
  };
  console.log(time);
  return time;
}
module.exports = {
  getDate,
  getLocalUnixTimestamp,
};
