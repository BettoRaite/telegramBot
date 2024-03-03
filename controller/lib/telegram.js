import errorHandler from "./helpers.js";
import { handleCommand } from "./commandHandling.js";
import { COMMANDS } from "./constants.js";

export async function handleMessage(messageObj) {
  const userMessage = messageObj.text ?? "";

  if (!userMessage) {
    errorHandler("No message text", "handleMessage", "telegram.js");
    return;
  }

  const chatId = String(messageObj.chat.id);
  const unixTime = messageObj.date;

  const COMMANDS_LIST = Object.values(COMMANDS);
  if (userMessage.startsWith("/") || COMMANDS_LIST.includes(userMessage)) {
    const command = userMessage;
    return handleCommand(chatId, command, unixTime);
  }
}
