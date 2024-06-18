import handleCommand from "./handleCommand.js";
/**
 * Description placeholder
 *
 * @async
 * @param {*} messageObj
 * @returns {unknown}
 */
async function handleMessageObject(messageObj) {
	const {
		text: userMessage,
		chat: { id: userId } = {},
	} = messageObj;

	if (typeof userMessage !== "string" || userMessage.trim() === "") {
		return;
	}
	if (typeof userId !== "number") {
		return;
	}

	// const COMMANDS_LIST = Object.values(COMMANDS.custom);

	if (userMessage.startsWith("/")) {
		handleCommand(userId, userMessage);
	}
	return new Promise((resolve) => {
		setTimeout(resolve, 1000, "welcome");
	});
}

export default handleMessageObject;
