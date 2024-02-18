import { getDateUTC5 } from "./time.js";
export function processScheduleData(scheduleData, unixtTimestamp) {
  try {
    const date = getDateUTC5(unixtTimestamp);
    const weekday = date.weekdays_eng;
    console.log(weekday);
    const scheduleOnSpecificDay = scheduleData[weekday];
    if (scheduleOnSpecificDay) {
      return JSON.parse(scheduleOnSpecificDay);
    }
    return JSON.parse(scheduleData["mainSchedule"]);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.log(err, scheduleData);
      return [];
    }
    throw err;
  }
}
