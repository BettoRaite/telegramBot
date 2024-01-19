const { hasReachedUploadLimit } = require("../lib/telegram");

const LIMIT = 5;
const SUBSTRING = "text";
describe("hasReachedUploadLimit", () => {
  describe(`Counts how many prop names in an object 
  contain passed in substring and check if more than or equal to the provided limit`, () => {
    test("If object has less prop names that contain the specific substring than the limit return false", () => {
      const obj = {
        abctext: 1,
        abctext1: 1,
        abctext2: 2,
      };
      expect(hasReachedUploadLimit(obj, LIMIT, SUBSTRING)).toBe(false);
    });
    test("If object has prop names that contain the specific substring more than or equal to the limit return true", () => {
      const obj = {
        abctext: 1,
        abctext1: 1,
        abctext2: 2,
        abctext3: 2,
        abctext4: 2,
      };
      expect(hasReachedUploadLimit(obj, LIMIT, SUBSTRING)).toBe(true);
    });
  });

  describe(`Should handle passing invalid args`, () => {
    test("If passed in first arg is not object should return true and call error func", () => {
      const arr = ["In case if"];
      const num = 12;
      const bool = true;
      expect(hasReachedUploadLimit(arr, LIMIT, SUBSTRING)).toBe(true);
      expect(hasReachedUploadLimit(num, LIMIT, SUBSTRING)).toBe(true);
      expect(hasReachedUploadLimit(bool, LIMIT, SUBSTRING)).toBe(true);
    });
    test("If passed in second arg is not number type should return true and call error func", () => {
      const obj = {
        abctext: 1,
        abctext1: 1,
        abctext2: 2,
      };
      expect(hasReachedUploadLimit(obj, "not number", SUBSTRING)).toBe(true);
    });
    test("If passed in third arg is not string type should return true and call error func", () => {
      const obj = {
        abctext: 1,
        abctext1: 1,
        abctext2: 2,
      };
      expect(hasReachedUploadLimit(obj, LIMIT, false)).toBe(true);
    });
  });
});
