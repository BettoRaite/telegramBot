import { getUserGroupName } from "../lib/firebase.js";

async function getGroupStudySchedule() {
  const USER_ID = "6363652773";
  console.log(await getUserGroupName(USER_ID));
}
getGroupStudySchedule();

if (false) {
  const today = new Date();
  today.setHours(8, 55, 0, 0);
  console.log(today.getUTCHours(), today.getHours());
  const UNIX_TIMESTAMP = today.getTime() / 1000; // 1707625297

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
    const TIMEZONE_DIFF_SEC = 5 * 3600;
    const local = (UNIX_TIMESTAMP + TIMEZONE_DIFF_SEC) * 1000;
    const date = new Date(local);
    console.log(date);

    getStudyTimeInfo("123132", UNIX_TIMESTAMP, timeIntervals);
  })();
}
