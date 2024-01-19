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
function getDate(unixTimestamp) {
  if (!Number.isFinite(unixTimestamp)) {
    errorHandler("unixTimestamp expected to be of type number", "getDate", "date");
    return null;
  }

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
  const CONV_FACTOR = 1000;

  const timestamp = unixTimestamp * CONV_FACTOR;
  const date = new Date(timestamp);

  const day = Number(date.getUTCDate());
  const month = Number(date.getUTCMonth()) + OFFSET;
  const year = Number(date.getUTCFullYear());
  const weekday = Number(date.getUTCDay());

  const time = {
    day,
    month: month,
    year,
    weekday: weekdaysRu[weekday],
    strDate: `${day}-${month}-${year}`,
  };
  return time;
}
module.exports = {
  getDate,
  getLocalUnixTimestamp,
};
