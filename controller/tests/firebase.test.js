const { sortDates } = require("../lib/firebase");

if (false) {
  describe("sortDates", () => {
    describe(`sorts string dates arr by year, month, day in the format ["day-month-year"]`, () => {
      test("", () => {
        const dates = ["20-1-2024", "12-1-2025", "12-1-2024"];
        const sortedDates = ["12-1-2024", "20-1-2024", "12-1-2025"];
        expect(String(sortDates(dates))).toBe(String(sortedDates));
      });
      test("", () => {
        const dates = ["14-11-2024", "20-1-2024", "12-1-2025", "12-1-2024"];
        const sortedDates = ["12-1-2024", "20-1-2024", "14-11-2024", "12-1-2025"];
        expect(String(sortDates(dates))).toBe(String(sortedDates));
      });
    });
  });
}
