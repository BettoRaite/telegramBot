/* eslint-disable require-jsdoc */
import {describe, it} from 'mocha';
import {expect, assert} from 'chai';
import {
  throwTypeErrorFromTemplate,
  convertToJSON,
} from '../lib/utils/customErrors.js';
import {DATA_TYPES} from '../lib/constants.js';

describe('convertToJSON', () => {
  describe('Converts values to json with custom conversion', ()=>{
    it(`Should stringify values of data type undefined to 'undefined'`, ()=>{
      assert.isString(convertToJSON(undefined));
      const obj = {
        userName: '@gas',
        userId: undefined,
      };
      assert.isString(JSON.parse(convertToJSON(obj)).userId);
    });
    it(`Should stringify function values to 'function'`, ()=>{
      const objWithFunction = {
        f1: ()=>{},
        f2() {},
      };
      const arrWithFunction = [()=>{}];
      assert.isString(convertToJSON(()=>{}));
      assert.isString(JSON.parse(convertToJSON(objWithFunction)).f1);
      assert.isString(JSON.parse(convertToJSON(arrWithFunction))[0]);
    });
    it(`Should convert a map to an object and stringify it`, ()=>{
      assert.isString(convertToJSON(undefined));
      const map = new Map();
      map.set([123, 12, 31, 23], 'this is an array');
      map.set({undefined: undefined}, 'this is an object');
      const expectedValue = {
        [JSON.stringify([123, 12, 31, 23])]: 'this is an array',
        // The undefined is already pre-converted.
        [JSON.stringify({undefined: 'undefined'})]: 'this is an object',
      };
      assert.deepEqual(convertToJSON(map),
          JSON.stringify(expectedValue, null, 2));
    });
    it(`Should convert a set to an array and stringify it`, ()=>{
      const arr = [1, 2, 3, 4, 5, 6];
      const set = new Set(arr);
      assert.deepEqual(convertToJSON(set),
          JSON.stringify(arr, null, 2));
    });
    it(`Should throw error if passing circular reference`, ()=>{
      expect(()=> {
        const obj = {};
        obj.himself = obj; // creating circular reference.
        convertToJSON(obj);
      },
      ).to.be.throw(TypeError);
    });
  });
});

if (false) {
  describe('typeErrorFromTemplate', () => {
    describe('Throws a TypeError generated from a description template', ()=>{
      it('Should return a TypeError from a description template', ()=>{
        // eslint-disable-next-line max-len
        let expectedDescription = 'variable: socks was expected to be an array, instead got this: undefined';
        const socks = undefined;
        expect(()=> {
          throwTypeErrorFromTemplate('socks', DATA_TYPES.array, socks);
        },
        ).to.be.throw(TypeError, expectedDescription);
        // eslint-disable-next-line max-len
        expectedDescription = 'variable: age was expected to be a number, instead got this: []';
        const age = [];
        expect(()=> {
          throwTypeErrorFromTemplate('age', DATA_TYPES.number, age);
        },
        ).to.be.throw(TypeError, expectedDescription);
      });
    });
  });
}
