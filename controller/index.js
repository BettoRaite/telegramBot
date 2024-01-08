const { errorHandler } = require("./lib/helpers");
const { handleMessage } = require("./lib/telegram");
const { sendMessage, sendSubjectsOptionMenu } = require("./lib/send");
const { uploadProccessedData, getData } = require("./lib/firebase");
const { subjectHandler } = require("./lib/telegram");

const {
  SUBJECT_NAMES,
  UPLOAD_BTN_NAME,
  GET_BTN_NAME,
  HOMEWORK_UPLOAD_MESSAGE,
} = require("./lib/constants");

async function handler(req, method) {
  try {
    const methodLowCase = method.toLowerCase();

    switch (methodLowCase) {
      case "get": {
        const path = req.path;

        switch (path) {
          case "/test-upload":
            await uploadProccessedData();
            return "success";
          case "/test-get":
            const data = await getData("math");
            return JSON.stringify(data, null, 4);
          default:
            return "Hi!";
        }
      }
      case "post":
        console.log(
          "------------------------------------------------------------------------BEGIN"
        );
        console.log(req);
        console.log("------------------------------------------------------------------------END");
        const callbackQuery = req.body.callback_query;
        if (callbackQuery) {
          return handleCallbackQuery(callbackQuery);
        }
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
function handleCallbackQuery(callbackQuery) {
  try {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    /*
  GET ACTION
  SUBJECT NAME  ---> INCLUDED

*/
    switch (data) {
      case UPLOAD_BTN_NAME:
        subjectHandler.setAction(UPLOAD_BTN_NAME);
        sendSubjectsOptionMenu(chatId);
        return "callback-query-upload";
      default:
        if (SUBJECT_NAMES.includes(data)) {
          const subjectName = data;
          const method = subjectHandler.getAction();
          subjectHandler.setSubject(subjectName);

          switch (method) {
            case UPLOAD_BTN_NAME:
              sendMessage(chatId, HOMEWORK_UPLOAD_MESSAGE);
              break;
            // case GET_BTN_NAME:
            //   messageObj = { chat: { id: chatId }, text: "get" };
            //   handleMessage(messageObj);
            //   break;
          }
        }
    }
  } catch (error) {
    errorHandler(error, "handleCallbackQuery");
  }
  //   case GET_BTN_NAME:
  //     subjectHandler.setMethod(GET_BTN_NAME);
  //     sendSubjectsOptionMenu(chatId);
  //     return "callback-query-get";

  //     return "callback-query-selected-subject";
  // }
}

module.exports = { handler };
