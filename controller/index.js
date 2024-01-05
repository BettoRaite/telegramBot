const {
  handleMessage,
  sendMessage,
  subjectHandler,
  sendSubjectsOptionMenu,
} = require("./lib/telegram");
const { errorHandler } = require("./lib/helpers");
const {
  SUBJECT_NAMES,
  UPLOAD_BTN_NAME,
  GET_BTN_NAME,
  HOMEWORK_UPLOAD_MESSAGE,
} = require("./lib/constants");
const { uploadProccessedData, getData } = require("./lib/firebase");

async function handler(req, method) {
  try {
    const methodLowCase = method.toLowerCase();

    if (methodLowCase === "get") {
      const path = req.path;

      // ----TEST-----
      switch (path) {
        case "/test-upload":
          await uploadProccessedData();
          return "success";
        case "/test-get":
          const data = await getData("math");
          return JSON.stringify(data, null, 4);
        default:
          return "Hello Get";
      }
      // ----TEST-----
    } else if (methodLowCase === "post") {
      const callbackQuery = req.body.callback_query;
      if (callbackQuery) {
        const data = callbackQuery.data;
        const chatId = callbackQuery.message.chat.id;
        switch (data) {
          case UPLOAD_BTN_NAME:
            subjectHandler.setMethod(UPLOAD_BTN_NAME);
            sendSubjectsOptionMenu(chatId);
            return "callback-query-upload";
          case GET_BTN_NAME:
            subjectHandler.setMethod(GET_BTN_NAME);
            sendSubjectsOptionMenu(chatId);
            return "callback-query-get";
          default:
            if (SUBJECT_NAMES.includes(data)) {
              const subjectName = data;
              const method = subjectHandler.getMethod();
              subjectHandler.setSubject(subjectName);
              switch (method) {
                case UPLOAD_BTN_NAME:
                  sendMessage(chatId, HOMEWORK_UPLOAD_MESSAGE);
                  break;
                case GET_BTN_NAME:
                  messageObj = { chat: { id: chatId }, text: "get" };
                  handleMessage(messageObj);
                  break;
              }
            }
            return "callback-query-selected-subject";
        }
      }

      errorHandler("Unknown callback query", "mainIndexHandler");
    }
    const { body } = req;

    if (body && body.message) {
      const messageObj = body.message;
      await handleMessage(messageObj);
      return "Success";
    }
    return "Unknown request";
  } catch (error) {
    errorHandler(error, "mainIndexHandler");
  }
}
module.exports = { handler };
