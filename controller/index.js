const { handleMessage, sendMessage } = require("./lib/telegram");
const { errorHandler } = require("./lib/helpers");
const { uploadProccessedData, getData } = require("./lib/firebase");

async function handler(req, method) {
  try {
    if (method.toLowerCase() === "get") {
      const path = req.path;

      if (path === "/test-upload") {
        await uploadProccessedData();
        return "success";
      }
      if (path === "/test-get") {
        const data = await getData("math");
        return JSON.stringify(data, null, 4);
      }
      return "Hello Get";
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
