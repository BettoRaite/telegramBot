const { getStudyTimeInfo } = require("../lib/time");

const UNIX_TIMESTAMP = 1707625297;

(async () => {
  const GROUP_NAME = "23-03";
  const timeIntervals = [
    ["8:00", "8:45"],
    ["8:50", "9:35"],
    ["9:45", "10:30"],
    ["10:35", "11:20"],
    ["11:30", "13:00"],
    ["13:10", "13:55"],
    ["14:00", "14:40"],
  ];
  getStudyTimeInfo(UNIX_TIMESTAMP, timeIntervals);
})();
