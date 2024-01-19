const { getLocalUnixTimestamp, getDate } = require("../lib/date");
const {
  addUser,
  setAction,
  getUser,
  setSubject,
  deleteUser,
  getResetKey,
  setImageProccessingToTrue,
  users,
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
