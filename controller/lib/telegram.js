const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");

const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText) {
  return axiosInstance
    .get("sendMessage", {
      chat_id: chatId || MY_GROUP_CHAT_ID,
      text: messageText,
    })
    .catch((ex) => {
      errorHandler(ex, "sendMessage", "axios");
    });
}
async function handleMessage(messageObj) {
  const messageText = messageObj.text ?? "";
  if (!messageText) {
    errorHandler("No message text", "handleMessage");
    return "";
  }
  try {
    const chatId = messageObj.chat.id;
    if (messageText.charAt(0) === "/") {
      const command = messageText.slice(1).toLowerCase();
      switch (command) {
        case "math":
          return sendMessage(chatId, "ok got that");
        case "russian":
          return sendMessage(chatId, "russian");
        case "history":
          return sendMessage(chatId, "history");
        case "physics":
          return sendMessage(chatId, "Physics");
        case "chemistry":
          return sedMessage(chatId, "chemistry");
        case "geography":
          return sendMessage(chatId, "geography");
        case "biology":
          return sendMessage(chatId, "biology");
        case "computer-science":
          return sendMessage(chatId, "computer-science");
        case "obj":
          return sendMessage(chatId, "obj");
        case "literature":
          return sendMessage(chatId, "literature");

        default:
          return sendMessage(chatId, "What are you typing??????");
      }
    } else {
      sendMessage(chatId, messageText + "()))))))))))))))))0 C новым годом долбаёб!");
    }
  } catch (error) {
    errorHandler(error, "handleMessage");
  }
}
module.exports = { sendMessage, handleMessage };
