import { BOT_MESSAGES } from "../constants";
import errorHandler from "../helpers";
import { sendMessage, sendStartMenu } from "../send";

const users = new Map();

export const addUser = (userId) => {
  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "addUser");
  }

  if (!users.has(userId)) {
    // Creating user object, pushing to map
    users.set(userId, {
      action: "",
      subjectName: "",
      isImageUploading: false,
      resetKey: Symbol("Unique reset key for the current user state"),
      hasReset: false,
      imageIdsQueue: [],
      caption: "",
    });
  }

  return users.get(userId);
};

export const setAction = (userId, actionName) => {
  if (typeof userId !== "string" || typeof actionName !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "setAction");
    return null;
  }
  // Check if the user already exists in the users map, if not create one and assign "action"
  const user = users.has(userId) ? getUser(userId) : addUser(userId);
  if (!user) {
    errorHandler("User is undefined", "setSubject", "user.js");
  }
  user.action = actionName;
  return users.get(userId);
};
export const setSubject = (userId, subjectName) => {
  if (typeof userId !== "string" || typeof subjectName !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "setSubject", "user.js");
    return null;
  }
  const user = users.get(userId);
  if (!user) {
    errorHandler("User is undefined", "setSubject", "user.js");
  }
  user.subjectName = subjectName;
  return users.get(userId);
};
export const setImageUploadingToTrue = (userId) => {
  // If image proccessing true we don't delete user metadata, but wait for text message
  // since the number of images might be undefined
  if (typeof userId !== "string") {
    errorHandler(
      new TypeError("User id must be of type string"),
      "setImageProccessingToTrue",
      "user.js"
    );
  }
  const user = users.get(userId);
  if (!user) {
    errorHandler("User is undefined", "setImageUploadingToTrue", "user.js");
    return null;
  }
  user.isImageUploading = true;
  return users.get(userId);
};
export const queueImageId = (userId, imageId) => {
  if (typeof imageId !== "string" || typeof userId !== "string") {
    errorHandler(new TypeError("image id must be of type string"), "users", "queueImageId");
    return null;
  }
  const user = getUser(userId);
  if (!user) {
    errorHandler("user is undefined", "queueImageId", "user.js");
    return null;
  }
  const imageIdsQueue = user.imageIdsQueue;
  imageIdsQueue.push(imageId);
  return imageIdsQueue;
};
export const queueCaption = (userId, caption) => {
  if (typeof caption !== "string" || typeof userId !== "string") {
    errorHandler(new TypeError("caption must be of type string"), "queueCaption", "user.js");
    return null;
  }
  const user = getUser(userId);
  if (!user) {
    errorHandler("user is undefined", "queueCaption", "user.js");
    return null;
  }
  user.caption = caption;
  return user;
};
export const getUser = (userId) => {
  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "getUser");
    return null;
  }
  return users.get(userId);
};
export const getResetKey = (userId) => {
  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "getResetKey");
    return null;
  }
  return users.get(userId)?.resetKey;
};

export const deleteUser = (userId) => {
  console.log("Deleting user.\n", JSON.stringify(getUser(userId), null, 4));

  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "deleteUser");
    return null;
  }
  return users.delete(userId);
};

export const deleteUserAfter = (userId, timeSec) => {
  const user = getUser(userId);

  if (!user) {
    errorHandler(new Error("Trying to reset undefined user"), "users", "deleteUserAfter");
  }
  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "deleteUserAfter");
    return null;
  }
  const resetKey = user.resetKey;
  if (!user.hasReset) {
    console.log("Running delete user after...");
    user.hasReset = true;

    setTimeout(async () => {
      if (getResetKey(userId) === resetKey && !getUser(userId)?.isImageUploading) {
        await sendMessage(userId, BOT_MESSAGES.exceededUnresponseTime);
        sendStartMenu(userId);

        return deleteUser(userId);
      }
      console.log("User object has already been deleted.");
    }, 1000 * timeSec);
  }
};
