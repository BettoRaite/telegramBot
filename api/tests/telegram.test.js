if (true) {
  describe("createReplyKeyboardLayout", () => {
    describe("Creates a buttons layout, where the number of buttons per row is equal to the number of cols", () => {
      describe(`If number of cols passed is more than or equal to the buttons list len 
      the length of returned arr should equal to 1`, () => {
        test("If cols passed equals to 2 and buttons list len is 2 should return array with length 1", () => {
          const BUTTONS = ["b1", "b2"];
          const COLS = 2;
          const maxBtnsPerRow = Math.ceil(BUTTONS.length / COLS);
          expect(createReplyKeyboardLayout(COLS, BUTTONS).length).toBe(maxBtnsPerRow);
        });
        test("If cols passed equals to 3 and buttons list len is 1 should return array with length 1", () => {
          const BUTTONS = ["b1"];
          const COLS = 3;
          const maxBtnsPerRow = Math.ceil(BUTTONS.length / COLS);
          expect(createReplyKeyboardLayout(COLS, BUTTONS).length).toBe(maxBtnsPerRow);
        });
      });

      describe(`If number of cols passed is less than or equal to 0 
        the length of returned arr should equal to buttons list len`, () => {
        test("If cols passed equals to -1 and buttons list len is 2 should return array with length 2", () => {
          const BUTTONS = ["b1", "b2"];
          const COLS = -1;
          const maxBtnsPerRow = BUTTONS.length;
          expect(createReplyKeyboardLayout(COLS, BUTTONS).length).toBe(maxBtnsPerRow);
        });
        test("If cols passed equals to 0 and buttons list len is 2 should return array with length 2", () => {
          const BUTTONS = ["b1", "b2"];
          const COLS = 0;
          const maxBtnsPerRow = BUTTONS.length;
          expect(createReplyKeyboardLayout(COLS, BUTTONS).length).toBe(maxBtnsPerRow);
        });
      });

      describe(`If number of cols passed is less than buttons list len 
        the length of returned arr should equal to 
        buttons list len divided by the number of cols rounded up`, () => {
        test("If cols passed equals to 2 and buttons list len is 3 should return array with length 2", () => {
          const BUTTONS = ["b1", "b2", "b3"];
          const COLS = 2;
          const maxBtnsPerRow = Math.ceil(BUTTONS.length / COLS);
          // so it should create layout like this.
          /*[
                    [button1 button2]
                    [button3]
                ]            
              */
          expect(createReplyKeyboardLayout(COLS, BUTTONS).length).toBe(maxBtnsPerRow);
        });
        test("If cols passed equals to 3 and buttons list len is 7 should return array with length 3", () => {
          const BUTTONS = ["b1", "b2", "b3", "b1", "b2", "b3", "b1"];
          const COLS = 3;
          const maxBtnsPerRow = Math.ceil(BUTTONS.length / COLS);
          expect(createReplyKeyboardLayout(COLS, BUTTONS).length).toBe(maxBtnsPerRow);
        });
      });
      describe(`Handling bad cases`, () => {
        test("If cols passed is floating point number should return null", () => {
          const BUTTONS = ["b1", "b2", "b3"];
          const COLS = 1.123;
          expect(createReplyKeyboardLayout(COLS, BUTTONS)).toBe(null);
        });
        test("If cols passed isn't a number data type should return null", () => {
          const BUTTONS = ["b1", "b2", "b3"];
          const COLS = NaN;
          expect(createReplyKeyboardLayout(COLS, BUTTONS)).toBe(null);
        });
        test("Buttons list isn't an array should return null", () => {
          const BUTTONS = {};
          const COLS = NaN;
          expect(createReplyKeyboardLayout(COLS, BUTTONS)).toBe(null);
        });
      });
    });
  });
}
