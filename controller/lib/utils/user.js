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
  // Check if the user already exists in the users map, if not create one and assign "action"
  const user = getUser(userId);
  const imageIdsQueue = user.imageIdsQueue;
  imageIdsQueue.push(imageId);
  return imageIdsQueue;
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
  console.log("deleted user successfully", getUser(userId));
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
    setTimeout(() => {
      if (getResetKey(userId) === resetKey) {
        sendMessage(userId, "упс вы ничего не написали");
        sendStartMenu(userId);
        console.log("Successfully deleted user");
        return users.delete(userId);
      }
      console.log("User object was already deleted");
    }, 1000 * timeSec);
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
};
