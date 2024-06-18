export const createReplyKeyboardLayout = (buttonsList, cols = 1) => {
	if (!Array.isArray(buttonsList)) {
		throw new SyntaxError()
	}
	if (!Number.isFinite(cols) || !Number.isInteger(cols)) {
		errorHandler(
			"cols is expected to be an integer",
			"createReplyKeyboardLayout",
			"telegram.js",
		);
		return null;
	}

	const buttonsListLen = buttonsList.length;
	const MIN_COLS = 1;
	const MAX_COLS = buttonsListLen;
	if (cols < MIN_COLS) {
		cols = MIN_COLS;
	} else if (cols > MAX_COLS) {
		cols = MAX_COLS;
	}

	const rows = Math.ceil(buttonsListLen / cols);
	const layout = [];

	for (let i = 0; i < rows; ++i) {
		const slicedButtonsList = buttonsList.slice(cols * i, cols * (i + 1));
		layout.push(createReplyButtonsArr(...slicedButtonsList));
	}
	return layout;
};

export const createReplyButtonsArr = (...buttonsList) => {
	const replyButtonsArr = [];
	for (const btnName of buttonsList) {
		if (typeof btnName !== "string") {
			errorHandler(
				`btnName is expected to be of type string,
          instead got ${buttonsList}`,
				"createReplyButtonsArr",
				"telegram.js",
			);
			return [];
		}
		const replyButton = { text: btnName };
		replyButtonsArr.push(replyButton);
	}

	return replyButtonsArr;
};

const COMMANDS_LIST = {
	start: "/start",
};

async function handleCommand(userId, command) {
	if (!(Number.isFinite(userId) && userId > 0)) {
		throw new TypeError("'userId' must be a positive integer.");
	}
	if (!(typeof command === "string" && command.startsWith("/"))) {
		throw new TypeError(
			"'command' was expected to be a string, starting with '/' character.",
		);
	}
	switch (command) {
		case COMMANDS_LIST.start: {
		}
	}
}
export default handleCommand;
