var http = require("http");

http
  .createServer(function (res, req) {
    res.write("LIVE");
    res.end();
  })
  .listen(8000);
