const { errorHandler } = require("./helpers");
const { uploadProccessedData, getDataOnDate, getData } = require("./firebase");
const {
  sendMessage,
  sendStartMenu,
  sendMenuCommands,
  sendPhoto,
  sendMultiplePhotos,
} = require("./send");
const { getLargestImageId } = require("./imageProccessing");
const {
  getUser,
  deleteUser,
  setImageUploadingToTrue,
  getResetKey,
  queueImageId,
} = require("./utils/user");
const { getDate, getLocalUnixTimestamp } = require("./date");
const uniqid = require("uniqid");
const {
  UPLOAD_SUCCESS_MESSAGE,
  CANCEL_OPERATION_SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  CANCEL_OPERATION_ERROR_MESSAGE,
  ERROR_DOC_UPLOAD_MESSAGE,
  UPLOAD_LIMIT_REACHED_MESSAGE,
  INVALID_MESSAGE,
  INTRODUCTION_TEXT,
} = require("./constantMessages");
const {
  SUBJECT_NAMES,
  UPLOAD_ACTION,
  GET_ACTION,
  IMAGE_DATA_PREFIX,
  TEXT_DATA_PREFIX,
} = require("./constants");
const { limit } = require("firebase/firestore");

async function handleMessage(messageObj) {
  const messageText = messageObj.text ?? "";
  const images = messageObj.photo;
  const imageDoc = messageObj.document;
  const caption = messageObj?.photo?.caption;
  console.log(messageObj);
  if (!messageText && !images && !imageDoc) {
    errorHandler("No message text", "handleMessage");
    return "";
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
        sendMessage(chatId, ERROR_DOC_UPLOAD_MESSAGE);
        return null;
      }

      const imageId = getLargestImageId(images);
      const unixTimestamp = messageObj.date;

      const params = {
        chatId,
        subjectName: user.subjectName,
        action: user.action,
        messageText,
        imageId,
        unixTimestamp,
        caption,
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
  const action = user.action;

  switch (command) {
    case "cancel":
      if (action) {
        // deleting user obj and cleanig users map
        deleteUser(chatId);
        await sendMessage(chatId, CANCEL_OPERATION_SUCCESS_MESSAGE);
      } else {
        await sendMessage(chatId, CANCEL_OPERATION_ERROR_MESSAGE);
      }
      return sendStartMenu(chatId, "Опции");
    case "start":
      await sendMessage(chatId, INTRODUCTION_TEXT);
      return sendStartMenu(chatId, "Опции");
    case "continue":
      await sendStartMenu(chatId);
      return sendStartMenu(chatId, "Опции");
  }
}
async function handleAction(params) {
  const { chatId, subjectName, action, messageText, imageId, unixTimestamp, caption } = params;

  switch (action) {
    case UPLOAD_ACTION: {
      // Getting date to later check if image limit reached *DDN*
      const timeZoneDiffsec = 5 * 3600;
      const dateObj = await getDate(getLocalUnixTimestamp(timeZoneDiffsec, unixTimestamp));
      const strDate = dateObj.strDate;
      // Getting data under certain date *DDN*
      const storageContent = await getDataOnDate(subjectName, strDate);

      if (SUBJECT_NAMES.includes(subjectName)) {
        if (messageText) {
          handleTextDataUpload(chatId, subjectName, strDate, messageText, storageContent);
          return;
        } else if (imageId) {
          handleImageDataUpload(chatId, subjectName, strDate, imageId, storageContent);
          return;
        }
      }
      errorHandler("Invalid subject name encountered", "handleAction");
      return;
    }

    case GET_ACTION: {
      deleteUser(chatId);
      await handleDataRetrival(chatId, subjectName);
      return;
    }
    default:
      throw new Error("Undefined action");
  }
}
async function handleDataRetrival(chatId, subjectName) {
  const data = await getData(subjectName);
  console.log(data);
  if (data) {
    const mediaArr = [];
    for (const val of Object.values(data)) {
      for (const propName in val) {
        if (propName.includes(TEXT_DATA_PREFIX)) {
          await sendMessage(chatId, val[propName]);
        } else if (propName.includes(IMAGE_DATA_PREFIX)) {
          const image = {
            type: "photo",
            media: val[propName],
          };
          mediaArr.push(image);
        }
      }
    }
    if (mediaArr.length > 0) {
      await sendMultiplePhotos(chatId, mediaArr);
    }
  }

  return sendStartMenu(chatId);
}
async function handleTextDataUpload(chatId, subjectName, strDate, textToUpload, storageContent) {
  // Check if the number of text fields more than the limit *DDN*
  const TEXT_UPLOAD_LIMIT = 2;
  // using common text prefix *DDN*
  // counts how much text we can upload
  const textLeftToUpload = countDataLeftToUpload(
    storageContent,
    TEXT_UPLOAD_LIMIT,
    TEXT_DATA_PREFIX
  );
  if (textLeftToUpload <= 0) {
    deleteUser(chatId); // clearing user from users map *DDN*
    await sendMessage(chatId, UPLOAD_LIMIT_REACHED_MESSAGE);

    return sendStartMenu(chatId);
  }

  // Creating a unique id with common prefix *DDN*
  const uniqueId = `${TEXT_DATA_PREFIX}${uniqid()}`;
  // Creating a new prop containing text data *DDN*
  storageContent[uniqueId] = textToUpload;
  // Updating it and loading to firestore *DDN*
  await uploadProccessedData(subjectName, strDate, storageContent);

  deleteUser(chatId); // Ok, data uploaded, clearing user from users map *DDN*
  console.log("✅");
  await sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);
  return sendStartMenu(chatId);
}

async function handleImageDataUpload(chatId, subjectName, strDate, imageId, storageContent) {
  // Check if the number of image fields more than the limit *DDN*
  const IMAGE_UPLOAD_LIMIT = 5;
  // using common text prefix *DDN*
  // counts how many images we can upload *DDN*
  const imagesLeftToUpload = countDataLeftToUpload(
    storageContent,
    IMAGE_UPLOAD_LIMIT,
    IMAGE_DATA_PREFIX
  );
  console.log(imagesLeftToUpload + " images to upload");
  // check if images left to upload is 0 or less  *DDN*
  if (imagesLeftToUpload < 1) {
    // clearing user from users map *DDN*
    if (getUser(chatId)) {
      deleteUser(chatId);
      await sendMessage(chatId, UPLOAD_LIMIT_REACHED_MESSAGE);
      sendStartMenu(chatId);
    }

    return;
  }

  queueImageId(chatId, imageId);

  const startImageUpLoad = async function (imagesToUpload) {
    setImageUploadingToTrue(chatId);

    await uploadProccessedData(subjectName, strDate, storageContent);
    if (imagesToUpload < 1) {
      deleteUser(chatId);
      sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);
      return;
    } else if (user.imageIdsQueue.length > 0) {
      const uniqueId = `${IMAGE_DATA_PREFIX}${uniqid()}`;
      console.log(uniqueId);
      // Creating a new prop containing text data *DDN*
      const user = getUser(chatId);
      storageContent[uniqueId] = user.imageIdsQueue.pop();

      startImageUpLoad(--imagesToUpload);
    }
    deleteUser(chatId);
    sendMessage(chatId, UPLOAD_SUCCESS_MESSAGE);
  };
  const user = getUser(chatId);
  const isImageUploading = user.isImageUploading;
  if (!isImageUploading) {
    sendMessage(chatId, `Будут загружены ${imagesLeftToUpload} картинки 🤖`);
    startImageUpLoad(imagesLeftToUpload);
  }
  // deleteUser(chatId); don't delete user since the user might send more images *DDN*

  return;
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
    errorHandler("Invalid argument value", "hasReachedUploadLimit", "telegram");
    // sending true to avoid data upload *DDN*
    return true;
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
