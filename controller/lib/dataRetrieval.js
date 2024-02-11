const { errorHandler } = require("./helpers");
const { getData, sortDates } = require("./firebase");
const { getDate, getLocalUnixTimestamp, getDateUTC5, calculateDateDiff } = require("./time");

const { FATAL_ERROR_MESSAGE, NO_DATA_FOUND } = require("./constantMessages");
const { IMAGE_DATA_PREFIX, TEXT_DATA_PREFIX, CAPTION_DATA_PREFIX } = require("./constants");

async function handleDataRetrival(subjectName) {
  const subjectData = await getData(subjectName);
  // Checking whether 'subjectData' is plain object and not an array *DDN*
  if (subjectData instanceof Object && !(subjectData instanceof Array)) {
    const propsLen = Object.keys(subjectData).length;
    // No data found *DDN*
    if (propsLen <= 0) {
      // No data found text *DDN*
      return NO_DATA_FOUND;
    }
    const dataToSend = await handleDataProcessing(subjectData);
    return dataToSend;
  }
  errorHandler("data doesn't exist", "handleDataRetrival", "telegram.js");
  return FATAL_ERROR_MESSAGE;
}
async function handleDataProcessing(subjectData) {
  // Sorting dates *DDN*
  const dates = Object.keys(subjectData);
  const sortedDates = sortDates(dates);
  // Iterating through sorted dates *DDN*
  for (const docDateStr of sortedDates) {
    const dataOnCertainDate = subjectData[docDateStr];
    // Filtering data on text and image *DDN*
    const filteredData = filterData(dataOnCertainDate);
    // If data of a certain date isn't an object return error *DDN*
    if (!filteredData) {
      errorHandler("error filtering data", "handleDataSending", "telegram.js");
      return FATAL_ERROR_MESSAGE;
    }
    const [textData, mediaArr] = filteredData;

    // const reversedDate = dateObj.reversedStrDate;
    const docDate = new Date(docDateStr);
    const currentDate = new Date();
    const reversedStrDate = getDate(0, docDateStr).reversedStrDate;

    const dateText = calculateDateDiff(currentDate, docDate);
    const formattedText = formatText(dateText, reversedStrDate, textData);

    return [formattedText, mediaArr];
  }
}
function filterData(dataOnCertainDate) {
  if (dataOnCertainDate instanceof Object && !(dataOnCertainDate instanceof Array)) {
    const textData = [];
    const mediaArr = [];

    for (const dataName in dataOnCertainDate) {
      if (dataName.includes(TEXT_DATA_PREFIX) || dataName.includes(CAPTION_DATA_PREFIX)) {
        textData.push(dataOnCertainDate[dataName]);
      } else if (dataName.includes(IMAGE_DATA_PREFIX)) {
        mediaArr.push({
          type: "photo",
          media: dataOnCertainDate[dataName],
        });
      }
    }
    return [textData, mediaArr];
  }
  errorHandler("dataOnCertainDate is undefined", "filterData", "telegram.js");
  return null;
}
function formatText(dateText, reversedDate, textData) {
  dateText = dateText.slice(0, 1).toUpperCase() + dateText.slice(1);
  let formattedText = `🗓 <i>Дата</i>: <b>${dateText}</b> <i>(${reversedDate})</i>\n\n`;
  let count = 1;
  for (const text of textData) {
    formattedText += `✍️ <b>Запись (${count})</b> \n ${text}\n\n`;
    ++count;
  }
  return formattedText;
}
module.exports = {
  handleDataRetrival,
};
