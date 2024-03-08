import {assert, expect} from 'chai';
import {describe, it, context} from 'mocha';

import {
  parseTimeZone,
  filterThisWeekdayStudySchedule,
  processTimeInfo,
} from '../lib/dataProcessing.js';
import {BOT_MESSAGES} from '../lib/constants.js';

if (false) {
  // press ctrl+f, and replace false with true to run all tests.
  describe('parseTimeZone', () => {
    describe(`Parses timeZone in format \'hh:mm\'
    returns utc offset in sec`, () => {
      describe('Good cases', () => {
        it('Passing in \'06:30\' should return (6 * 3600) + (30 * 60)', () => {
          const hsInSec = 6 * 3600;
          const minsInSec = 30 * 60;
          const expectedOffset = hsInSec + minsInSec;
          const timeZome = '06:30';
          expect(parseTimeZone(timeZome)).to.be.deep.equal(expectedOffset);
        });
        it('Passing in \'5:00\' should return (5 * 3600) + (0 * 60) ', () => {
          const hInSec = 5 * 3600;
          const minInSec = 0 * 60;
          const expectedOffset = hInSec + minInSec;
          const timeZome = '5:00';
          expect(parseTimeZone(timeZome)).to.be.deep.equal(expectedOffset);
        });
        it('Passing in \'0:0\' should return (0 * 3600) + (0 * 60) ', () => {
          const expectedOffset = 0;
          const timeZome = '0:0';
          expect(parseTimeZone(timeZome)).to.be.deep.equal(expectedOffset);
        });
      });

      describe('Bad cases', () => {
        it(`Passing in any data type other than string
        should throw type error`, () => {
          const expectedDescription = 'timeZone is expected to be a string';
          assert.throws(() => parseTimeZone(1), TypeError, expectedDescription);
        });
        it(`If passing in arbitrary string 
        should throw syntax error`, () => {
          const expectedDescription = `
          timeZone is expected to be in the format \'hh:mm\'`;
          assert.throws(
              () => parseTimeZone('swerwefef'),
              SyntaxError, expectedDescription);
        });
        it(`If passing in time zone difference >= 24 hours
        should throw syntax error`, () => {
          const timeZome = '24:00';
          const expectedDescription = `
          hours difference is out of bounds, timeZone - (24:00)`;
          assert.throws(
              () => parseTimeZone(timeZome),
              SyntaxError, expectedDescription);
        });
        it(`If passing in time zone difference <= -24 hours 
        should throw syntax error`, () => {
          const timeZome = '-24:00';
          const expectedDescription = `
          hours difference is out of bounds, timeZone - (-24:00)`;
          assert.throws(
              () => parseTimeZone(timeZome),
              SyntaxError, expectedDescription);
        });
        it(`If passing in time zone with min difference >= 60 minutes
        should throw syntax error`, () => {
          const timeZome = '6:70';
          const expectedDescription = `
          minutes difference is out of bounds, timeZone - (6:70)`;
          assert.throws(
              () => parseTimeZone(timeZome),
              SyntaxError, expectedDescription);
        });
        it(`If passing in time zone with min difference < 0 minutes 
        should throw syntax error`, () => {
          const timeZome = '3:-10';
          const expectedDescription = `
          minutes difference is out of bounds, timeZone - (3:-10)`;
          assert.throws(
              () => parseTimeZone(timeZome),
              SyntaxError, expectedDescription);
        });
      });
    });
  });
}

if (false) {
  // press ctrl+f, and replace false with true to run all tests.
  describe('filterThisWeekdayStudySchedule', () => {
    describe(`returns study schedule 
    on the current week day or default one`, () => {
      describe('Good cases', () => {
        it(`If studySchedules is defined correctly
        should return an array`, () => {
          const localTime = new Date();
          const timeIntervals = [
            ['8:00', '8:45'],
            ['8:50', '9:35'],
            ['9:45', '10:30'],
          ];
          const studySchedules = {
            default: JSON.stringify(timeIntervals),
          };
          expect(
              String(filterThisWeekdayStudySchedule(studySchedules, localTime)),
          ).to.be.deep.equal(String(timeIntervals));
        });
        describe(`If studySchedules obj has studyschedule
        on a certain weekday and the current weekday match that weekday
        should return study schedule on that weekday`, () => {
          it(`If there is study schedule on friday and the current weekday 
          is friday should return study schedule on friday`, () => {
            const localTime = new Date('2024-02-23'); // monday
            const timeIntervals = [['8:00', '8:45']];
            const studySchedules = {
              friday: JSON.stringify(timeIntervals),
            };
            expect(
                String(
                    filterThisWeekdayStudySchedule(
                        studySchedules,
                        localTime)),
            ).to.be.deep.equal(String(timeIntervals));
          });
          it(`If there is study schedule on monday and the current weekday 
          is monday should return study schedule on monday`, () => {
            const localTime = new Date('2024-02-19'); // monday
            const timeIntervals = [
              ['8:00', '8:45'],
              ['8:50', '9:35'],
              ['9:45', '10:30'],
            ];
            const studySchedules = {
              monday: JSON.stringify(timeIntervals),
            };
            expect(
                String(
                    filterThisWeekdayStudySchedule(
                        studySchedules,
                        localTime)),
            ).to.be.deep.equal(String(timeIntervals));
          });
        });
      });
      describe('Bad cases', () => {
        it('Should throw type error if studySchedules isn\'t object', () => {
          const studySchedules = undefined;
          const expectedDescription = `
          studySchedules was expected to be an object, 
          instead got this ${studySchedules}`;
          assert.throws(
              () => filterThisWeekdayStudySchedule(studySchedules),
              TypeError,
              expectedDescription,
          );
        });
        it(`Should throw type error 
        if localTime is not an instance of date`, () => {
          const localTime = {};

          const expectedDescription = `
          localTime was expected to be an instance of date,
          instead got this ${localTime}`;
          assert.throws(
              () => filterThisWeekdayStudySchedule({}, localTime),
              TypeError,
              expectedDescription,
          );
        });
        it(`Throws error if study schedule in study schedules object 
        can not be parsed by JSON.parse`, () => {
          const localTime = new Date();
          const studySchedules = {
            default: undefined,
          };
          assert.throws(
              () => filterThisWeekdayStudySchedule(studySchedules, localTime),
              SyntaxError,
          );
        });
      });
    });
  });
}
if (true) {
  // press ctrl+f, and replace false with true to run all tests.
  describe('processTimeInfo', () => {
    describe(`constructs a message for the user from time info`, () => {
      context(`when calculated difference between user time 
      is not in range of study day interval`,
      () => {
        it(`if first element in the array is -1 
            should return the given message: ${1}`, () => {
          const timeInfo = [-1];
          assert.deepEqual(
              processTimeInfo(timeInfo),
              BOT_MESSAGES.studyDayNotStarted);
        });
        it(`if first element in the array is -1
            should return the given message: ${1}`, () => {
          const timeInfo = [1];
          assert.deepEqual(
              processTimeInfo(timeInfo),
              BOT_MESSAGES.studyDayFinished);
        });
      },
      );
      context(
          `when calculated difference between user time
          is in range of study day interval`,
          () => {
            const expectedMessage = `
          ${BOT_MESSAGES.untilStudyDayEnd} 1ч 1м
          ${BOT_MESSAGES.untilStudySessionEnd} 1ч 1м
          ${BOT_MESSAGES.untilLessonEnd} 1ч 1м
          `;
            it(`if all objects with props
            hours, minutes in the array are not set to 0
            should return the given message ${expectedMessage}`, () => {
              const timeDiff = {
                hours: 1,
                minutes: 1,
              };
              const timeInfo = [timeDiff, timeDiff, timeDiff];
              assert.deepEqual(processTimeInfo(timeInfo), expectedMessage);
            });
          },
      );
    });
  });
}
