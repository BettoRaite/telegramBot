export default function errorHandler(error, funcName, from) {
  const loggerFunction = console.log;

  loggerFunction("\n\n::::START::::");
  if (from === "axios") {
    loggerFunction("Error occured in " + funcName);
    if (error.response) {
      loggerFunction(error.response.data);
      loggerFunction(error.response.status);
      loggerFunction(error.response.headers);
    } else if (error.request) {
      loggerFunction(error.request);
    } else {
      loggerFunction("Error", error.message);
    }
    loggerFunction(error.toJSON());
  } else {
    loggerFunction(`Error: ${error}\nError occured in: ${funcName}\nfile: ${from}`);
  }
  loggerFunction("::::END::::\n\n");
}
