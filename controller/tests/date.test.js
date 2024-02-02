const { Timestamp } = require("firebase/firestore");
const { getLocalUnixTimestamp, getDate, calculateDateDiff } = require("../lib/date");
const {
  addUser,
  setAction,
  getUser,
  setSubject,
  deleteUser,
  getResetKey,
} = require("../lib/utils/user");

const unixTimestamp = 1705166940;
const UTC_5_SEC = 5 * 3600;

if (false) {
  describe("Get unix time relative to the user", () => {
    describe("Output unix timestamp must be equal to time zone difference in seconds + unix timestamp", () => {
      test("UTC+5", () => {
        expect(getLocalUnixTimestamp(UTC_5_SEC, unixTimestamp)).toBe(unixTimestamp + UTC_5_SEC);
      });
      test("UTC+4", () => {
        const UTC_4_SEC = 4 * 3600;
        expect(getLocalUnixTimestamp(UTC_4_SEC, unixTimestamp)).toBe(unixTimestamp + UTC_4_SEC);
      });
      test("UTC+0", () => {
        expect(getLocalUnixTimestamp(0, unixTimestamp)).toBe(unixTimestamp);
      });
    });
    describe("If any argument is not number should return null", () => {
      test("passing no argument", () => {
        expect(getLocalUnixTimestamp()).toBe(null);
      });
      test("passing one argument", () => {
        expect(getLocalUnixTimestamp(0)).toBe(null);
      });
      test("passing one argument", () => {
        expect(getLocalUnixTimestamp(null, 123123)).toBe(null);
      });
    });
  });
}

if (false) {
  describe("Get unix time to date", () => {
    describe("Passing unix time should give time object that has day, month, year and weekday props", () => {});
    describe("Passing in unix time should return time object", () => {
      test("Day should equal to the current one", () => {
        expect(getDate(unixTimestamp + UTC_5_SEC).day).toBe(13);
      });
      test("Month should equal to the current one", () => {
        expect(getDate(unixTimestamp + UTC_5_SEC).month).toBe(1);
      });
      test("Year should equal to the current one", () => {
        expect(getDate(unixTimestamp + UTC_5_SEC).year).toBe(2024);
      });
      test("Weekday should equal to the current one", () => {
        expect(getDate(unixTimestamp + UTC_5_SEC).weekday).toBe("Пятница");
      });
      test("String date should equal to the format 'day-month-year'", () => {
        expect(getDate(unixTimestamp + UTC_5_SEC).strDate).toBe("13-1-2024");
      });
    });
  });
}
if (true) {
  describe("calculateDateDiff", () => {
    // Creating doc creation date object at the end of the week
    const SUNDAY = "2024-01-28";
    const currentDate = new Date(SUNDAY);

    describe(`Calculates the seconds difference between current date and doc creation date and 
    expresses it in terms of  "today", "yesterday", 
    "the day before yesterday","any weekday", "last week {weekday}", "long time ago"`, () => {
      describe(`The doc date in sec is more than the week beginning in sec of the current date,
       the following will happen`, () => {
        test("Passing two date objects created at the same time should return 'today'", () => {
          expect(calculateDateDiff(currentDate, currentDate)).toBe("сегодня");
        });
        test("Passing two date objects with sec difference >= 86400 should return 'yesterday'", () => {
          const SATURDAY = "2024-01-27";
          const docDate = new Date(SATURDAY);
          expect(calculateDateDiff(currentDate, docDate)).toBe("вчера");
        });
        test("Passing two date objects with sec difference >= 86400 * 2 should return 'the day before yesterday'", () => {
          const FRIDAY = "2024-01-26";
          const docDate = new Date(FRIDAY);
          expect(calculateDateDiff(currentDate, docDate)).toBe("позавчера");
        });
        test("Passing two date objects with sec difference >= 86400 * 3 should return 'Tuesday'", () => {
          const THURSDAY = "2024-01-25";
          const docDate = new Date(THURSDAY);
          expect(calculateDateDiff(currentDate, docDate)).toBe("четверг");
        });
      });
      describe(`The doc date in sec is less than the week beginning in sec of the current date,
      the following should happen`, () => {
        test("If doc date in sec is less than the week beginning in sec of the current date should return 'last week {weekday}'", () => {
          const SUNDAY = "2024-01-21"; // Sunday of the last week, the current week is (28-01-2024) sunday
          let WEEKDAY = "воскресенье";
          let docDate = new Date(SUNDAY);

          expect(calculateDateDiff(currentDate, docDate)).toBe(`прошлая неделя ${WEEKDAY}`);

          const SATURDAY = "2024-01-20"; // Saturday of the last week, the current week is (28-01-2024) sunday
          WEEKDAY = "суббота";
          docDate = new Date(SATURDAY);

          expect(calculateDateDiff(currentDate, docDate)).toBe(`прошлая неделя ${WEEKDAY}`);
        });
      });
      describe(`The doc date in sec is less than the last week beginning in sec relative to current date,
      the following should happen`, () => {
        test("Passing in doc date in sec less than last week beginning in sec should return 'long time ago'", () => {
          const JANUARY_START = "2024-01-01";
          let docDate = new Date(JANUARY_START);
          expect(calculateDateDiff(new Date(), docDate)).toBe("давно");
          const LAST_YEAR_JANUARY = "2023-01-01";
          docDate = new Date(LAST_YEAR_JANUARY);
          expect(calculateDateDiff(new Date(), docDate)).toBe("давно");
        });
      });
      describe(`All args must be date time object otherwise, the call will result in error`, () => {
        test("Passing non-date object as the current date should return null and print error'", () => {
          const LAST_YEAR_JANUARY = "2023-01-01";
          docDate = new Date(LAST_YEAR_JANUARY);
          expect(calculateDateDiff("", docDate)).toBe(null);
        });
        test("Passing non-date object as the current doc date should return null and print error'", () => {
          expect(calculateDateDiff(new Date(), "smart")).toBe(null);
        });
      });
    });
  });
}
