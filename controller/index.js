process.on("uncaughtException", (err) => {
  console.log("error");
});

import errorHandler from "./lib/helpers.js";
import { handleMessage } from "./lib/telegram.js";

// import { fetchUserGroupId, fetchGroupStudySchedules } from "./lib/firebase.js";

export default async function handler(req, method) {
  try {
    switch (method) {
      case "GET":
        const path = req.path;
        return handleGet(path);
    }

    const { body } = req;

    if (body && body.message) {
      const messageObj = body.message;
      await handleMessage(messageObj);
      return "Message received successfully";
    }
    return "Unknown request";
  } catch (error) {
    errorHandler(error, "mainIndexHandler", "index");
  }
}

async function handleGet(path) {
  const PROD = process.env.PROD;
  if (PROD) {
    switch (path) {
    }
  }
  return "Telegram bot server - Sonya.js";
}
