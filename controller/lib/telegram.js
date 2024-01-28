const { errorHandler } = require("./helpers");
const { uploadProccessedData, getData, sortDates } = require("./firebase");
const { sendMessage, sendStartMenu, sendMultiplePhotos, sendMenuCommands } = require("./send");
const { getLargestImageId } = require("./imageProccessing");
const {
  getUser,
  deleteUser,
  setImageUploadingToTrue,
  queueImageId,
  queueCaption,
} = require("./utils/user");
const { getDate, getLocalUnixTimestamp } = require("./date");
const uniqid = require("uniqid");
const ADMIN_IDS = process.env.ADMIN_IDS;

const {
  UPLOAD_SUCCESS_MESSAGE,
  CANCEL_OPERATION_SUCCESS_MESSAGE,
  FATAL_ERROR_MESSAGE,
  CANCEL_OPERATION_ERROR_MESSAGE,
  ERROR_DOC_UPLOAD_MESSAGE,
  UPLOAD_LIMIT_REACHED_MESSAGE,
  INVALID_MESSAGE,
  INTRODUCTION_TEXT,
  UNKNOWN_COMMAND,
  HOMEWORK_UPLOAD_MESSAGE,
  NO_DATA_FOUND,
  ACCESS_RESTRICTED_MESSAGE,
} = require("./constantMessages");
const {
  UPLOAD_ACTION,
  GET_ACTION,
  IMAGE_DATA_PREFIX,
  TEXT_DATA_PREFIX,
  CAPTION_DATA_PREFIX,
} = require("./constants");

async function handleMessage(messageObj) {
  const messageText = messageObj.text ?? "";
  const images = messageObj.photo;
  const imageDoc = messageObj.document;
  const caption = messageObj.caption;

  if (!messageText && !images && !imageDoc) {
    errorHandler("No message text", "handleMessage", "telegram.js");
    return null;
  }

  try {
    const chatId = String(messageObj.chat.id);
    const user = getUser(chatId) ?? {};
    if (messageText.startsWith("/")) {
      const command = messageText.slice(1).toLowerCase();
      return handleCommand(chatId, command, user);
    }

    if (user.action && user.subjectName) {
      if (imageDoc) {
        await sendMessage(chatId, ERROR_DOC_UPLOAD_MESSAGE);
        sendMessage(chatId, HOMEWORK_UPLOAD_MESSAGE);
        return null;
      }
      let hasImage = false;

      if (images) {
        const imageId = getLargestImageId(images);
        // Queueing imageId, which will be extracted later and saved to database *DDN*
        queueImageId(chatId, imageId);
        hasImage = true;
      }
      if (caption) {
        queueCaption(chatId, caption);
      }
      const unixTimestamp = messageObj.date;

      const params = {
        chatId,
        subjectName: user.subjectName,
        action: user.action,
        messageText,
        hasImage,
        unixTimestamp,
      };

      handleAction(params);
      return;
    }

    sendMessage(chatId, INVALID_MESSAGE);
  } catch (error) {
    errorHandler(error, "handleMessage");
  }
}
async function handleCommand(chatId, command, user) {
  const { action, subjectName } = user;

  switch (command) {
    case "test":
      sendMenuCommands(chatId);
      return;
    case "cancel":
      if (action || subjectName) {
        // deleting user obj and cleanig users map
        deleteUser(chatId);
        await sendMessage(chatId, CANCEL_OPERATION_SUCCESS_MESSAGE);
      } else {
        await sendMessage(chatId, CANCEL_OPERATION_ERROR_MESSAGE);
      }
      sendStartMenu(chatId);
      return;
    case "start":
      await sendMessage(chatId, INTRODUCTION_TEXT);
      sendStartMenu(chatId);
      return;
    case "sonyawhoareyou":
      await sendMessage(chatId, "Приветик, я Соня, а ты?");
      return;
    case "main":
      await sendMessage(chatId, "Поняла 😚");
      return sendStartMenu(chatId);
    default:
      await sendMessage(chatId, UNKNOWN_COMMAND);
      return;
  }
}
async function handleAction(params) {
  const { chatId, subjectName, action, messageText, hasImage, unixTimestamp } = params;

  switch (action) {
    case UPLOAD_ACTION:
      if (!ADMIN_IDS?.includes(chatId)) {
        deleteUser(chatId);
        await sendMessage(chatId, ACCESS_RESTRICTED_MESSAGE);
        sendStartMenu(chatId);
        return;
      }
      // Getting date to save and retrieve data *DDN*
      const timeZoneDiffsec = 5 * 3600;
      const dateObj = getDate(getLocalUnixTimestamp(timeZoneDiffsec, unixTimestamp));
      const strDate = dateObj.strDate; //
      // Getting subject storage content on certain date or empty object *DDN*
      const storageContent = await getData(subjectName, strDate);

      if (!(storageContent instanceof Object && !(storageContent instanceof Array))) {
        errorHandler("storageContent is undefined", "handleAction", "telegram.js");
        await sendMessage(chatId, FATAL_ERROR_MESSAGE);
        deleteUser(chatId);
        return;
      }

      const params = {
        chatId,
        subjectName,
        strDate,
        messageText,
        storageContent,
      };

      if (messageText) {
        handleTextDataUpload(params);
      } else if (hasImage) {
        handleImageDataUpload(params);
      }
      return;

    case GET_ACTION: {
      deleteUser(chatId);

      await handleDataRetrival(chatId, subjectName);
      return;
    }
    default:
      throw new Error("Undefined action");
  }
}
async function handleTextDataUpload(params) {
  const { chatId, subjectName, strDate, messageText, storageContent } = params;
  // Check if the number of text fields more than the limit *DDN*
  const TEXT_UPLOAD_LIMIT = 3;
  // using common text prefix *DDN*
  // counts how much text we can upload

  const textLeftToUpload = countDataLeftToUpload(
    storageContent,
    TEXT_UPLOAD_LIMIT,
    TEXT_DATA_PREFIX
  );
  if (textLeftToUpload <= 0) {
    const dataUploadType = " текст";
    deleteUser(chatId); // clearing user from users map *DDN*
    await sendMessage(chatId, UPLOAD_LIMIT_REACHED_MESSAGE + dataUploadType);

    return sendStartMenu(chatId);
  }

  // Creating a unique id with common prefix *DDN*
  const uniqueId = `${TEXT_DATA_PREFIX}${uniqid()}`;
  // Adding a new prop containing text data *DDN*
  storageContent[uniqueId] = messageText;
  // Loading to firestore *DDN*
  await uploadProccessedData(subjectName, strDate, storageContent);

  deleteUser(chatId); // Ok, data uploaded, clearing user from users map *DDN*
  await sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);
  return sendStartMenu(chatId);
}

async function handleImageDataUpload(params) {
  const { chatId, subjectName, strDate, storageContent } = params;
  // Check if the number of image fields more than the limit *DDN*
  const IMAGE_UPLOAD_LIMIT = 10;
  // using common text prefix *DDN*
  // counts how many images we can upload *DDN*
  const imagesLeftToUpload = countDataLeftToUpload(
    storageContent,
    IMAGE_UPLOAD_LIMIT,
    IMAGE_DATA_PREFIX
  );
  // check if images left to upload is 0 or less  *DDN*
  if (imagesLeftToUpload < 1) {
    // clearing user from users map *DDN*
    if (getUser(chatId)) {
      const dataUploadType = " изображения.";
      deleteUser(chatId);
      await sendMessage(chatId, UPLOAD_LIMIT_REACHED_MESSAGE + dataUploadType);
      sendStartMenu(chatId);
    }

    return;
  }

  const user = getUser(chatId);

  if (!user) {
    errorHandler("user is undefined", "handleImageDataUpload", "telegram.js");
    return;
  }
  const isImageUploading = user.isImageUploading;

  if (!isImageUploading && user) {
    setImageUploadingToTrue(chatId);
    await sendMessage(
      chatId,
      `Оставшейся кол-во мест для загрузки картинок: ${imagesLeftToUpload}  🤖`
    );
    const params = {
      imagesLeftToUpload,
      chatId,
      subjectName,
      strDate,
      storageContent,
    };
    await startImageUpLoad(params);
    sendStartMenu(chatId);
  }

  // deleteUser(chatId); don't delete user since the user might send more images *DDN*

  return;
}
async function startImageUpLoad(params) {
  const { subjectName, strDate, storageContent, imagesLeftToUpload, chatId } = params;

  const user = getUser(chatId);

  if (!user) {
    errorHandler("user is undefined", "startImageUpLoad", "telegram.js");
    return;
  }
  const CAPTIONS_UPLOAD_LIMIT = 2;

  const captionLeftToUpload = countDataLeftToUpload(
    storageContent,
    CAPTIONS_UPLOAD_LIMIT,
    CAPTION_DATA_PREFIX
  );

  const caption = user.caption;
  const captionDataId = `${CAPTION_DATA_PREFIX}${uniqid()}`;

  for (let i = 0; i < imagesLeftToUpload; ++i) {
    // generating unique id *DDN*
    const generatedId = uniqid();
    const imageDataId = `${IMAGE_DATA_PREFIX}${generatedId}`;
    const userImgId = user?.imageIdsQueue?.pop();

    if (!userImgId) {
      await sendMessage(chatId, ERROR_MESSAGE);
      errorHandler("user is undefined while uploading images", "startImageUpLoad", "telegram.js");
      return;
    }
    if (caption && captionLeftToUpload > 0) {
      storageContent[captionDataId] = caption;
    }
    // saving to our storage var *DDN*
    storageContent[imageDataId] = userImgId;
    // uploading image id *DDN*
    await uploadProccessedData(subjectName, strDate, storageContent);

    // checking if image queue length equals to zero *DDN*
    if (user.imageIdsQueue.length === 0) {
      // deleting the user var *DDN*
      deleteUser(chatId);
      await sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);
      return;
    }
  }

  const totalUnuploadedImgs = user.imageIdsQueue.length;
  const ununploadedText = `Кол-во не загруженных картинок: ${totalUnuploadedImgs} 😞\nпотому что был достигнут дневной лимит.`;

  deleteUser(chatId);

  await sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);
  await sendMessage(chatId, ununploadedText);

  return;
}
async function handleDataRetrival(chatId, subjectName) {
  const subjectData = await getData(subjectName);
  // Checking whether 'subjectData' is plain object and not an array *DDN*
  if (subjectData instanceof Object && !(subjectData instanceof Array)) {
    const propsLen = Object.keys(subjectData).length;
    // No data found *DDN*
    if (propsLen <= 0) {
      await sendMessage(chatId, NO_DATA_FOUND);
      sendStartMenu(chatId);
      return;
    }

    await handleDataSending(chatId, subjectData);

    sendStartMenu(chatId);
    return;
  }
  errorHandler("data doesn't exist", "handleDataRetrival", "telegram.js");
  await sendMessage(chatId, FATAL_ERROR_MESSAGE);
  return;
}
async function handleDataSending(chatId, subjectData) {
  // Sorting dates*DDN*
  const dates = Object.keys(subjectData);
  const sortedDates = sortDates(dates);
  const reversedSortedDates = sortedDates.reverse();
  // Iterating through sorted dates *DDN*
  for (const date of reversedSortedDates) {
    const dataOnDate = subjectData[date];
    // Filtering data on text and image *DDN*
    const filteredData = filterData(dataOnDate);
    // If data of a certain date isn't an object return error *DDN*
    if (!filteredData) {
      errorHandler("error filtering data", "handleDataSending", "telegram.js");
      await sendMessage(chatId, FATAL_ERROR_MESSAGE);
      return;
    }
    const [textData, mediaArr] = filteredData;
    const dateObj = getDate(0, date);
    const reversedDate = dateObj.reversedStrDate;
    const weekday = dateObj.weekday;
    const formattedText = formatText(weekday, reversedDate, textData);

    const params = {
      parse_mode: "HTML",
    };

    await sendMessage(chatId, formattedText, params);
    if (mediaArr.length > 0) {
      await sendMultiplePhotos(chatId, mediaArr);
    }
  }
}
function filterData(dataOnDate) {
  if (dataOnDate instanceof Object && !(dataOnDate instanceof Array)) {
    const textData = [];
    const mediaArr = [];

    for (const dataName in dataOnDate) {
      if (dataName.includes(TEXT_DATA_PREFIX) || dataName.includes(CAPTION_DATA_PREFIX)) {
        textData.push(dataOnDate[dataName]);
      } else if (dataName.includes(IMAGE_DATA_PREFIX)) {
        mediaArr.push({
          type: "photo",
          media: dataOnDate[dataName],
        });
      }
    }
    return [textData, mediaArr];
  }
  errorHandler("dataOnDate is undefined", "filterData", "telegram.js");
  return null;
}
function formatText(weekday, reversedDate, textData) {
  let formattedText = `🗓 <i>Дата</i>: <b>${weekday}</b> <i>(${reversedDate})</i>\n\n`;
  let count = 1;
  for (const text of textData) {
    formattedText += `✍️ <b>Запись (${count})</b> \n ${text}\n\n`;
    ++count;
  }
  return formattedText;
}
function countDataLeftToUpload(storageContent, limit, targetName) {
  if (
    // Check if storageContent is object and not instance of array *DDN*
    // revertValue(isObject and revertValue(isArray)) *DDN*
    !(storageContent instanceof Object && !(storageContent instanceof Array)) ||
    !Number.isFinite(limit) ||
    // target name isn't of data type string(always false), does target name data type name equal to string *DDN*
    typeof targetName !== "string"
  ) {
    errorHandler("Invalid argument value", "countDataLeftToUpload", "telegram");
    // sending 0 to avoid data upload *DDN*
    return 0;
  }
  let targetsTotal = 0;
  for (const propName of Object.keys(storageContent)) {
    if (propName.includes(targetName)) {
      ++targetsTotal;
    }
  }
  // Substracting total data from data limit *DDN*
  return limit - targetsTotal;
}

module.exports = {
  handleMessage,
  countDataLeftToUpload,
  handleAction,
};
