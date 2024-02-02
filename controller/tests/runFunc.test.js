const { calculateDateDiff } = require("../lib/date");

const SUNDAY = "2024-01-28";
const SATURDAY = "2024-01-27";
const currentDate = new Date(SUNDAY);
const docDate = new Date(SATURDAY);
calculateDateDiff(currentDate, docDate);
