import errorHandler from './helpers.js';
import {handleCommand} from './commandHandling.js';
import {COMMANDS} from './constants.js';
/**
 *
 * @param {messageObj} messageObj A telegram message object
 * @return {undefined}
 */
export async function handleMessage(messageObj) {
  const userMessage = messageObj.text ?? '';

  if (!userMessage) {
    errorHandler('No message text', handleMessage.name, 'telegram.js');
    return;
  }

  const userId = String(messageObj.chat.id);
  const unixTime = messageObj.date;

  const COMMANDS_LIST = Object.values(COMMANDS.custom);

  if (userMessage.startsWith('/') || COMMANDS_LIST.includes(userMessage)) {
    const command = userMessage;
    return handleCommand(userId, command, unixTime);
  }
}
