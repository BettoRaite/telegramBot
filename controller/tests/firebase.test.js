import { fetchUserGroupId, fetchDataOnGroup, initializeFirebaseApp, fetchUserDataById } from "../lib/firebase.js";
import chai, { assert, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { describe } from "mocha";
import uniqid from "uniqid";
chai.use(chaiAsPromised);

// :::Calling init
initializeFirebaseApp();
// :::Calling init

if (false) {
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

if (false) {
  describe("fetchUserGroupId", () => {
    describe("should return user's group id", () => {
      describe("Good cases", () => {
        it("Passing id of user that exists in db and has group id prop should return group id", async () => {
          const userId = "test";
          const groupId = "test";
          await expect(fetchUserGroupId(userId)).to.eventually.deep.equal(groupId);
        });
      });
      describe("Bad cases", () => {
        it("if user id isn't a string should throw type error", async () => {
          const expectedDescription = "userId is expected to be a string";
          await expect(fetchUserGroupId()).to.be.rejectedWith(TypeError, expectedDescription);
        });
        it("if user id isn't found in db should throw syntax error", async () => {
          const uniqueId = String(uniqid());
          const expectedDescription = "user doesn't exist";
          await expect(fetchUserGroupId(uniqueId)).to.be.rejectedWith(
            SyntaxError,
            expectedDescription
          );
        });
        it("if fetched user doesn't have the groupId property should throw SyntaxError", async () => {
          const userId = "NOT_GROUP_MEMBER";
          const expectedDescription = "user is not a member of any group";
          await expect(fetchUserGroupId(userId)).to.be.rejectedWith(
            SyntaxError,
            expectedDescription
          );
        });
      });
    });
  });
}

if (false) {
  describe("fetchDataOnGroup", () => {
    describe("should return data of an existing group", () => {
      describe("Good cases", () => {
        it("Passing id of an existing group in a db should return group data", async () => {
          const groupName = "test";
          const data = await fetchDataOnGroup(groupName);
          const expectedType = "object";
          expect(data).to.be.an(expectedType);
        });
      });
      describe("Bad cases", () => {
        it("If group id isn't string type should throw type error", async () => {
          const expectedDescription = "groupId is expected to be a string";
          await expect(fetchDataOnGroup()).to.be.rejectedWith(TypeError, expectedDescription);
        });

        it("Passing id of a group that doesn't exist in db should throw syntax error", async () => {
          const uniqueId = String(uniqid());
          const expectedDescription = "group doesn't exist";
          await expect(fetchDataOnGroup(uniqueId)).to.be.rejectedWith(
            SyntaxError,
            expectedDescription
          );
        });
      });
    });
  });
}
if(true) {
  describe("fetchUserDataById", ()=>{
    describe("Fetches all user data associated with a specific user id", ()=>{
      it("If user exists in a db should return an object", async ()=>{
        const userId = "test"; // using an id of an already defined user
        const fetchedUserData = await fetchUserDataById(userId);
        assert.isObject(fetchedUserData);
      })
      it("If user doesn't exist in a db should return null", async ()=>{
        const userId = "somerandomIdwhichdoesn'texist"; 
        const fetchedUserData = await fetchUserDataById(userId);
        assert.isNull(fetchedUserData);
      })
      it("If user id is not a string should throw type error", async ()=>{
        const userId = null; 
        const expectedMessage = ``
        expect().to.be.throw(TypeError)
      })
    })
  })
}