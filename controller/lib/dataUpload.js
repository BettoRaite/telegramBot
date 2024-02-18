import { UPLOAD_SUCCESS_MESSAGE, UPLOAD_LIMIT_REACHED_MESSAGE } from "./constantMessages.js";
import { IMAGE_DATA_PREFIX, TEXT_DATA_PREFIX, CAPTION_DATA_PREFIX } from "./constants.js";
import errorHandler from "./helpers.js";
import { uploadProccessedData } from "./firebase.js";
import { sendMessage, sendStartMenu } from "./send.js";

import { getUser, deleteUser, setImageUploadingToTrue } from "./utils/user.js";
import uniqid from "uniqid";

export async function handleTextDataUpload(params) {
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
export async function handleImageDataUpload(params) {
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
export function handleScheduleUpload() {}
