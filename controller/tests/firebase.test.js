import { assert } from "chai";
import { toSortedDates } from "../lib/firebase.js";

if (true) {
  describe("sortDates", () => {
    describe(`sorts string dates arr in an ascending order by year, month, day in the format ["year-month-day"]`, () => {
      it("test1", () => {
        const dates = ["2024-01-20", "2025-01-12", "2024-01-12"];
        const sortedDates = ["2024-01-12", "2024-01-20", "2025-01-12"];

        assert.strictEqual(String(toSortedDates(dates)), String(sortedDates));
      });
      it("test2", () => {
        const dates = ["2024-01-21", "2025-01-12", "2025-01-13", "2026-05-12", "2017-01-12"];
        const sortedDates = ["2017-01-12", "2024-01-21", "2025-01-12", "2025-01-13", "2026-05-12"];
        assert.strictEqual(String(toSortedDates(dates)), String(sortedDates));
      });
    });
  });
}
