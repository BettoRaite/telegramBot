import { assert, expect } from "chai";
import { describe } from "mocha";
import { TIME } from "../lib/constants.js";
import {
  timeDiffWithinInterval,
  getSecSinceDayBegin,
  timeDiffWithinStudySession,
  isStudySession,
  timeDiffWithinLesson,
} from "../lib/time.js";
import { parseTimeZone, parseTime } from "../lib/dataProcessing.js";

if (false) {
  describe("parseTimeZone", () => {
    describe("Parses timeZone in format 'hh:mm' and returns utc offset in sec", () => {
      describe("Good cases", () => {
        it("Passing in '06:30' should return (6 * 3600) + (30 * 60)", () => {
          const hsInSec = 6 * 3600;
          const minsInSec = 30 * 60;
          const expectedOffset = hsInSec + minsInSec;
          const timeZome = "06:30";
          expect(parseTimeZone(timeZome)).to.be.deep.equal(expectedOffset);
        });
        it("Passing in '5:00' should return (5 * 3600) + (0 * 60) ", () => {
          const hInSec = 5 * 3600;
          const minInSec = 0 * 60;
          const expectedOffset = hInSec + minInSec;
          const timeZome = "5:00";
          expect(parseTimeZone(timeZome)).to.be.deep.equal(expectedOffset);
        });
        it("Passing in '0:0' should return (0 * 3600) + (0 * 60) ", () => {
          const expectedOffset = 0;
          const timeZome = "0:0";
          expect(parseTimeZone(timeZome)).to.be.deep.equal(expectedOffset);
        });
      });

      describe("Bad cases", () => {
        it("Passing in any data type other than string should throw type error", () => {
          const expectedDescription = "timeZone is expected to be a string";
          assert.throws(() => parseTimeZone(1), TypeError, expectedDescription);
        });
        it("If passing in arbitrary string should throw syntax error", () => {
          const expectedDescription = "timeZone is expected to be in the format 'hh:mm'";
          assert.throws(() => parseTimeZone("swerwefef"), SyntaxError, expectedDescription);
        });
        it("If passing in time zone difference >= 24 hours should throw syntax error", () => {
          const timeZome = "24:00";
          const expectedDescription = "hours difference is out of bounds, timeZone - (24:00)";
          assert.throws(() => parseTimeZone(timeZome), SyntaxError, expectedDescription);
        });
        it("If passing in time zone difference <= -24 hours should throw syntax error", () => {
          const timeZome = "-24:00";
          const expectedDescription = "hours difference is out of bounds, timeZone - (-24:00)";
          assert.throws(() => parseTimeZone(timeZome), SyntaxError, expectedDescription);
        });
        it("If passing in time zone with min difference >= 60 minutes should throw syntax error", () => {
          const timeZome = "6:70";
          const expectedDescription = "minutes difference is out of bounds, timeZone - (6:70)";
          assert.throws(() => parseTimeZone(timeZome), SyntaxError, expectedDescription);
        });
        it("If passing in time zone with min difference < 0 minutes should throw syntax error", () => {
          const timeZome = "3:-10";
          const expectedDescription = "minutes difference is out of bounds, timeZone - (3:-10)";
          assert.throws(() => parseTimeZone(timeZome), SyntaxError, expectedDescription);
        });
      });
    });
  });
}
if (false) {
  describe("parseTime", () => {
    describe("Parses time in the format 'hh:mm' and returns the parsed time in seconds", () => {
      context(
        `if time doesn't go beyond +-24 hours range inclusive, and 0 <= minutes < 60,
           then should return parsed time in seconds`,
        () => {
          for (let h = 24; h >= -TIME.hours_per_day; --h) {
            for (let m = 0; m < TIME.min_per_hour; ++m) {
              let expectedValue = 0;
              if (h < 0) {
                expectedValue = h * TIME.hours_to_sec - m * TIME.min_to_sec;
              } else {
                expectedValue = h * TIME.hours_to_sec + m * TIME.min_to_sec;
              }

              const min = `${m < 10 && m > -10 ? "0" : ""}${m}`;

              const time = `${h}:${min}`;

              it(`if time is ${time}, should return ${expectedValue} seconds`, () => {
                assert.deepEqual(parseTime(time), expectedValue);
              });
            }
          }
        }
      );
      describe("Special cases", () => {
        it("Should handle empty space", () => {
          const time = "7              :                        12";
          const expectedValue = 7 * TIME.hours_to_sec + 12 * TIME.min_to_sec;
          assert.deepEqual(parseTime(time), expectedValue);
        });
      });

      describe("Bad cases", () => {
        it("If hours > +-24 should throw error", () => {
          let time = "-25:03";
          let expectedDescription = `time is out of bounds, time - (${time}). Hours must be <= +-24, minutes must be >= 0 and <= 59`;
          expect(() => parseTime(time)).to.throw(SyntaxError, expectedDescription);
          time = "25:12";
          expectedDescription = `time is out of bounds, time - (${time}). Hours must be <= +-24, minutes must be >= 0 and <= 59`;
          expect(() => parseTime(time)).to.throw(SyntaxError, expectedDescription);
        });
        it("If mins >= 60 or min < 0 should throw error", () => {
          let time = "07:60";
          let expectedDescription = `time is out of bounds, time - (${time}). Hours must be <= +-24, minutes must be >= 0 and <= 59`;
          expect(() => parseTime(time)).to.throw(SyntaxError, expectedDescription);
          time = "07:-1";
          expectedDescription = `time is out of bounds, time - (${time}). Hours must be <= +-24, minutes must be >= 0 and <= 59`;
          expect(() => parseTime(time)).to.throw(SyntaxError, expectedDescription);
        });
      });
    });
  });
}

if (false) {
  describe("timeDiffWithinInterval", () => {
    describe(`Calculates time difference between timeC and timeB in sec, if timeC is
    in the interval between timeA and timeB inclusive, 
    returns an object with hours rouded down, minutes rounded to the nearest int`, () => {
      const timeA = 8 * TIME.hours_to_sec;
      const timeB = 14 * TIME.hours_to_sec + 40 * TIME.min_to_sec;

      for (let h = 0; h < TIME.hours_per_day; ++h) {
        for (let m = 0; m < TIME.min_per_hour; ++m) {
          describe(`if timeC: ${h}:${
            m < 10 ? 0 : ""
          }${m}, is in the interval of timeA: 0${8}:00 and timeB: ${14}:${40}, should return 
          an object with props hours and minutes`, () => {
            const timeC = h * TIME.hours_to_sec + m * TIME.min_to_sec;

            if (timeC < timeA) {
              it("timeC is less than timeA should return -1", () => {
                assert.deepEqual(timeDiffWithinInterval(timeC, timeA, timeB), -1);
              });
              return;
            }
            if (timeC > timeB) {
              it("timeC is more than timeB should return 1", () => {
                assert.deepEqual(timeDiffWithinInterval(timeC, timeA, timeB), 1);
              });
              return;
            }

            it("if timeC is in the interval between timeA and timeB inclusive should return an object ", () => {
              const timeDiff = timeB - timeC;
              const timeDiffObj = {
                hours: Math.floor(timeDiff / TIME.hours_to_sec),
                minutes: Math.round((timeDiff % TIME.hours_to_sec) / TIME.min_to_sec),
              };
              assert.deepEqual(
                JSON.stringify(timeDiffWithinInterval(timeC, timeA, timeB)),
                JSON.stringify(timeDiffObj)
              );
            });
          });
        }
      }
      describe("Bad cases", () => {
        it("If timeC isn't number should throw error", () => {
          const expectedDescription = `timeSec, startInterval, endInterval were expected to be a number instead got this timeSec: ${undefined}, startInterval: ${0}, endInterval: ${0}`;

          expect(() => timeDiffWithinInterval(undefined, 0, 0)).to.throw(
            SyntaxError,
            expectedDescription
          );
        });
        it("If timeA isn't number should throw error", () => {
          const expectedDescription = `timeSec, startInterval, endInterval were expected to be a number instead got this timeSec: ${0}, startInterval: ${undefined}, endInterval: ${0}`;

          expect(() => timeDiffWithinInterval(0, undefined, 0)).to.throw(
            SyntaxError,
            expectedDescription
          );
        });
        it("If timeB isn't number should throw error", () => {
          const expectedDescription = `timeSec, startInterval, endInterval were expected to be a number instead got this timeSec: ${0}, startInterval: ${0}, endInterval: ${undefined}`;

          expect(() => timeDiffWithinInterval(0, 0, undefined)).to.throw(
            SyntaxError,
            expectedDescription
          );
        });
      });
    });
  });
}
if (false) {
  describe("getSecSinceDayBegin", () => {
    describe("calculates seconds passed since the day beginning", () => {
      const endDay = 10;
      for (let day = 0; day < endDay; ++day) {
        for (let h = 0; h < TIME.hours_per_day; ++h) {
          for (let m = 0; m < TIME.min_per_hour; ++m) {
            const dayBeginInSec = day * TIME.day_to_sec;
            const offset = h * TIME.hours_to_sec + m * TIME.min_to_sec;
            const unixTime = dayBeginInSec + offset;
            it(`if unix time is ${unixTime} should return ${offset}`, () => {
              assert.deepEqual(getSecSinceDayBegin(unixTime), offset);
            });
          }
        }
      }
    });
    describe("Special cases", () => {
      it(`if unix time is 1708936931 should return ${
        8 * TIME.hours_to_sec + 42 * TIME.min_to_sec
      }`, () => {
        const unixTime = 1708936931; // February 26, 2024 8:42:11 AM
        const expectedValue = 8 * TIME.hours_to_sec + 42 * TIME.min_to_sec;
        assert.deepEqual(getSecSinceDayBegin(unixTime), expectedValue);
      });
    });
    describe("Bad cases", () => {
      it("if unix time passed is not number should throw type error", () => {
        const expectedDescription = `unixTime was expected to be a number instead got this ${undefined}`;
        expect(() => getSecSinceDayBegin(undefined)).to.throw(TypeError, expectedDescription);
      });
    });
  });
}

if (true) {
  describe("timeDiffWithinStudySession", () => {
    const expectedTimeDiff = {
      hours: 0,
      minutes: 0,
    };

    describe(`Calculates time difference between the time since the 
    beginning of a day in sec and study session end time, if the time is in range of 
    study session start and end times inclusive`, () => {
      context("time is not in the range of study session start and end times inclusive", () => {
        const studySchedule = [
          //[0]                      [1]    [0] - start time, [1] - end time
          ["8:00", "8:45", "8:50", "9:35"], // <--- study session
          ["9:45", "10:30", "10:35", "11:20"], // <--- study session
          ["11:30", "13:00"], // <--- study session
          ["13:10", "13:55", "14:00", "14:40"], // <--- study session
        ];

        it("if time is before session start time should return object with props hours, minutes set to 0", () => {
          const timeSeconds = 7 * TIME.hours_to_sec + 45 * TIME.min_to_sec; // 7:45 AM
          const studySessionDurationSec = 2 * 45 * TIME.min_to_sec + 5 * TIME.min_to_sec;

          const timeDiff = timeDiffWithinStudySession(
            timeSeconds,
            studySchedule,
            studySessionDurationSec
          );
          assert.deepEqual(JSON.stringify(timeDiff), JSON.stringify(expectedTimeDiff));
        });
        it("if time is after session end time should return object with props hours, minutes set to 0", () => {
          const timeSeconds = 16 * TIME.hours_to_sec + 45 * TIME.min_to_sec; // 16:45 PM
          const studySessionDurationSec = 2 * 45 * TIME.min_to_sec + 5 * TIME.min_to_sec;

          const timeDiff = timeDiffWithinStudySession(
            timeSeconds,
            studySchedule,
            studySessionDurationSec
          );
          assert.deepEqual(JSON.stringify(timeDiff), JSON.stringify(expectedTimeDiff));
        });
      });
      context(
        `if study session endTime - startTime <= study session duration, then prop
        isStudySession of returned time diff should be true
        `,
        () => {
          it(`if the time is in the range of study session start and end times inclusive 
          should return time diff with props hours(rounded down), minutes(rounded) and isStudySession`, () => {
            const h_min = 8;
            const h_max = 14;

            const studySchedule = [
              ["8:00", "8:45", "8:50", "9:35"],
              ["9:45", "10:30", "10:35", "11:20"],
              ["11:30", "13:00"],
              ["13:10", "13:55", "14:00", "14:40"],
            ];

            for (let i = 0; i < studySchedule.length; ++i) {
              for (let h = h_min; h < h_max; ++h) {
                for (let m = 0; m < TIME.min_per_hour; ++m) {
                  const timeStartStr = studySchedule[i][0];
                  const timeEndStr = studySchedule.at(i).at(-1);

                  const timeStart = parseTime(timeStartStr);
                  const timeEnd = parseTime(timeEndStr);

                  const zero_m = m < 10 ? "0" : "";
                  const zero_h = h < 10 ? "0" : "";
                  const refTime = h * TIME.hours_to_sec + m * TIME.min_to_sec;

                  if (timeStart <= refTime && refTime <= timeEnd) {
                    it(`when ${zero_h}${h}:${zero_m}${m} is range of ${timeStartStr} and ${timeEndStr} 
                    should return time diff obj with hours(rounded down) and minutes(rounded) `, () => {
                      const diff = timeEnd - refTime;
                      const studySessionDurationSec =
                        2 * 45 * TIME.min_to_sec + 5 * TIME.min_to_sec;
                      const timeDiff = {
                        hours: Math.floor(diff / TIME.hours_to_sec),
                        minutes: Math.round((diff % TIME.hours_to_sec) / TIME.min_to_sec),
                        isStudySession: true,
                      };
                      assert.deepEqual(
                        JSON.stringify(
                          timeDiffWithinStudySession(
                            refTime,
                            studySchedule,
                            studySessionDurationSec
                          )
                        ),
                        JSON.stringify(timeDiff)
                      );
                    });
                  }
                }
              }
            }
          });
        }
      );
      it(`if study session endTime - startTime <= study session duration in seconds,
        should return an object with props hours and minutes set to 0  
        `, () => {
        const studySchedule = [
          ["8:15", "8:45"],
          ["8:55", "9:40", "9:45", "10:30"],
          ["9:45", "10:30", "10:35", "11:20"],
          ["11:30", "13:00"],
          ["13:10", "13:55", "14:00", "14:40"],
        ];

        const timeSeconds = parseTime("8:20");
        const endTime = parseTime(studySchedule[0][1]); // start time is `8:15`, end time is `8:45`

        // 01:35 minutes duration of one study session including a break
        const studySessionDurationSec = 2 * 45 * TIME.min_to_sec + 5 * TIME.min_to_sec;

        const timeDiff = timeDiffWithinStudySession(
          timeSeconds,
          studySchedule,
          studySessionDurationSec
        );

        assert.deepEqual(JSON.stringify(timeDiff), JSON.stringify(expectedTimeDiff));
      });
      describe("Bad cases", () => {
        it("If timeSeconds isn't a number should throw a syntax error", () => {
          const timeSeconds = null;
          const expectedDescription = `timeSeconds was expected to be a number instead got this ${timeSeconds}`;
          expect(() => timeDiffWithinStudySession(timeSeconds)).to.throw(
            SyntaxError,
            expectedDescription
          );
        });

        it("If studySchedule isn't an array should throw a syntax error", () => {
          const studySchedule = null;
          const expectedDescription = `studySchedule was expected to be an array instead got this ${studySchedule}`;
          expect(() => timeDiffWithinStudySession(0, studySchedule)).to.throw(
            SyntaxError,
            expectedDescription
          );
        });

        it("If studySessionDurationSec isn't a number should throw a syntax error", () => {
          const timeSeconds = 0;
          const studySchedule = [
            ["8:15", "8:45"],
            ["8:55", "9:40", "9:45", "10:30"],
            ["9:45", "10:30", "10:35", "11:20"],
            ["11:30", "13:00"],
            ["13:10", "13:55", "14:00", "14:40"],
          ];
          const studySessionDurationSec = null;
          const expectedDescription = `studySessionDurationSec was expected to be a number instead got this ${studySessionDurationSec}`;
          expect(() =>
            timeDiffWithinStudySession(timeSeconds, studySchedule, studySessionDurationSec)
          ).to.throw(SyntaxError, expectedDescription);
        });
      });
    });
  });
}
if (false) {
  describe("isStudySession", () => {
    describe("checks whether endTimeSec - startTimeSec >= studySessionDurationSec", () => {
      describe("Good cases", () => {
        it("if endTimeSec - startTimeSec >= studySessionDurationSec should return true", () => {
          let endTimeSec = 10;
          let startTimeSec = 5;
          let studySessionDurationSec = 5;
          assert.deepEqual(isStudySession(studySessionDurationSec, startTimeSec, endTimeSec), true);
          endTimeSec = 100;
          startTimeSec = 50;
          assert.deepEqual(isStudySession(studySessionDurationSec, startTimeSec, endTimeSec), true);
        });
        it("if endTimeSec - startTimeSec >= studySessionDurationSec should return true", () => {
          let endTimeSec = 10;
          let startTimeSec = 5;
          let studySessionDurationSec = 5;
          assert.deepEqual(isStudySession(studySessionDurationSec, startTimeSec, endTimeSec), true);
          endTimeSec = 100;
          startTimeSec = 50;
          assert.deepEqual(isStudySession(studySessionDurationSec, startTimeSec, endTimeSec), true);
        });
      });
      describe("Bad cases", () => {
        it("if studySessionDurationSec is not a number should throw a type error", () => {
          const studySessionDurationSec = null;
          const expectedDescription = `studySessionDurationSec was expected to be a number instead got this ${studySessionDurationSec}`;
          expect(() => isStudySession(studySessionDurationSec, 0, 0)).to.throw(
            TypeError,
            expectedDescription
          );
        });
        it("if startTimeSec is not a number should throw a type error", () => {
          const startTimeSec = null;
          const expectedDescription = `startTimeSec was expected to be a number instead got this ${startTimeSec}`;
          expect(() => isStudySession(0, startTimeSec, 0)).to.throw(TypeError, expectedDescription);
        });
        it("if endTimeSec is not a number should throw a type error", () => {
          const endTimeSec = null;
          const expectedDescription = `endTimeSec was expected to be a number instead got this ${endTimeSec}`;
          expect(() => isStudySession(0, 0, endTimeSec)).to.throw(TypeError, expectedDescription);
        });
      });
    });
  });
}
if (false) {
  describe(`timeDiffWithinLesson`, () => {
    describe(`Calculates time difference between a given time in sec and a lesson start, end times`, () => {
      describe(`should return a time diff obj with props hours(rounded down) and minutes(rounded)
          if a given time in sec is in range of the lesson start, end times`, () => {
        const walkedLessonIntervals = new Set();
        const studySchedule = [
          "8:00",
          "8:45",
          "8:50",
          "9:35",
          "9:45",
          "10:30",
          "10:35",
          "11:20",
          "11:30",
          "13:00",
          "13:10",
          "13:55",
          "14:00",
          "14:40",
        ];

        const START_HOUR = 8;
        const END_HOUR = 14;
        const PAIR_INTERVAL = 2;

        for (let i = 0; i < studySchedule.length; i += PAIR_INTERVAL) {
          for (let h = START_HOUR; h < END_HOUR; ++h) {
            for (let m = 0; m < TIME.min_per_hour; ++m) {
              const timeSec = h * TIME.hours_to_sec + m * TIME.min_to_sec;

              const startTimeStr = studySchedule.at(i);
              const endTimeStr = studySchedule.at(i + 1);

              walkedLessonIntervals.add(startTimeStr).add(endTimeStr);

              const startTime = parseTime(startTimeStr);
              const endTime = parseTime(endTimeStr);

              if (startTime <= timeSec && timeSec <= endTime) {
                it(`should return a time diff object when time is within lesson range inclusive`, () => {
                  const diff = endTime - timeSec;
                  const expectedTimeDiff = {
                    hours: Math.floor(diff / TIME.hours_to_sec),
                    minutes: Math.round((diff % TIME.hours_to_sec) / TIME.min_to_sec),
                  };
                  const timeDiff = timeDiffWithinLesson(timeSec, ...studySchedule);
                  assert.deepEqual(JSON.stringify(timeDiff), JSON.stringify(expectedTimeDiff));
                });
              }
            }
          }
        }
        it("Lessons walked should be equal to lessons number", () => {
          assert.deepEqual(walkedLessonIntervals.size, studySchedule.length);
        });
        describe("Bad cases", () => {
          it(`if time ins't in the range of lesson inclusively should return object with props hours
          minutes set to 0`, () => {
            const studySchedule = [
              "8:00",
              "8:45",
              "8:50",
              "9:35",
              "9:45",
              "10:30",
              "10:35",
              "11:20",
              "11:30",
              "13:00",
              "13:10",
              "13:55",
              "14:00",
              "14:40",
            ];
            const expectedTimeDiff = {
              hours: 0,
              minutes: 0,
            };

            let timeSec = 8 * TIME.hours_to_sec + 46 * TIME.min_to_sec; // "8:46"
            let startTimeStr = studySchedule[0]; //"8:00"
            let endTimeStr = studySchedule[1]; // "8:45"

            let timeDiff = timeDiffWithinLesson(timeSec, startTimeStr, endTimeStr);

            assert.deepEqual(JSON.stringify(timeDiff), JSON.stringify(expectedTimeDiff));

            timeSec = 13 * TIME.hours_to_sec + 56 * TIME.min_to_sec; // "13:56"
            startTimeStr = studySchedule.at(-2); //"14:00"
            endTimeStr = studySchedule.at(-1); // "14:40"

            timeDiff = timeDiffWithinLesson(timeSec, startTimeStr, endTimeStr);

            assert.deepEqual(JSON.stringify(timeDiff), JSON.stringify(expectedTimeDiff));
          });
          it("if timeSec isn't a number should throw type error", () => {
            const timeSec = undefined;
            const expectedMessage = `timeSeconds was expected to be a number instead got this ${timeSec}`;
            expect(() => {
              timeDiffWithinLesson(timeSec);
            }).to.be.throw(TypeError, expectedMessage);
          });
          it("if lessons end and start times aren't string time should throw syntax error", () => {
            const timeSec = 0;
            const studySchedules = undefined;
            const expectedMessage = `time is expected to be a string instead got this: ${studySchedules}`;
            expect(() => {
              timeDiffWithinLesson(timeSec, studySchedules);
            }).to.be.throw(TypeError, expectedMessage);
          });
        });
      });
    });
  });
}
