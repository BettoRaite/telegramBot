const { setAction, deleteUserAfter, addUser } = require("../lib/utils/user");

/* ~ "deleteUserAfer" description
    This function is supposed to delete the user 
    from the users map, after some time elapses    
    it's done so that  if the user doesn't type
    any messages the object gets destroyed.    
*/
describe("deleteUserAfter", () => {
  test("Should delete a user object after a given number of seconds passes", () => {
    const id = "cat";
    const seconds = "";
    addUser(id);
    deleteUserAfter(id);
  });
  describe("Error handling testing", () => {
    test("Should return error, if user hasn't been created", () => {});
    test("Should return error, if user hasn't been created", () => {});
  });

  test("Shouldn't delete user, if user has diffrent reset key", () => {});
});
