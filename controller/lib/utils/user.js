const { EXCEEDED_TIME_LIMIT } = require("../constantMessages");
const { errorHandler } = require("../helpers");
const { sendMessage, sendStartMenu } = require("../send");

const users = new Map();

function addUser(userId) {
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
}

function setAction(userId, actionName) {
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
}
function setSubject(userId, subjectName) {
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
}
function setImageUploadingToTrue(userId) {
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
}
function queueImageId(userId, imageId) {
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
}
function queueCaption(userId, caption) {
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
}
function getUser(userId) {
  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "getUser");
    return null;
  }
  return users.get(userId);
}
function getResetKey(userId) {
  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "getResetKey");
    return null;
  }
  return users.get(userId)?.resetKey;
}

function deleteUser(userId) {
  console.log("Deleting user.\n", JSON.stringify(getUser(userId), null, 4));

  if (typeof userId !== "string") {
    errorHandler(new TypeError("User id must be of type string"), "users", "deleteUser");
    return null;
  }
  return users.delete(userId);
}

function deleteUserAfter(userId, timeSec) {
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
        await sendMessage(userId, EXCEEDED_TIME_LIMIT);
        sendStartMenu(userId);

        return deleteUser(userId);
      }
      console.log("User object has already been deleted.");
    }, 1000 * timeSec);
  }
}

function deleteUserAfter5Min(userId) {
  const user = getUser(userId);
  const resetTimeSec = 5 * 60;

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
        await sendMessage(userId, EXCEEDED_TIME_LIMIT);
        sendStartMenu(userId);

        return deleteUser(userId);
      }
      console.log("User object has already been deleted.");
    }, 1000 * resetTimeSec);
  }
}

module.exports = {
  addUser,
  setAction,
  getUser,
  setSubject,
  deleteUser,
  deleteUserAfter,
  getResetKey,
  setImageUploadingToTrue,
  queueImageId,
  queueCaption,
  deleteUserAfter5Min,
};
