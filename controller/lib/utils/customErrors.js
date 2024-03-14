
import {getDataType} from './typeChecking.js';
import {isObject} from './typeChecking.js';
import {inspect} from 'node:util';
/** Generates a `TypeError` from a description template and throws it.
 * @param {string} variableName A variable name.
 * @param {string} expectedType An expected data type of the variable.
 * @param {any} value The actual of a variable.
 * @param {object} logOptions Any options to use for the util.inspect.
 * Defaults being used are:
 * {
 *   showHidden: false,
 *   compact: false,
 *   depth: 10,
 *   colors: true,
 * }
 * @return {void}
 * @throws {TypeError} Throws a generated `TypeError`
 * from a description template.
 * @example
const age = undefined;
throwTypeErrorFromTemplate('age', '[Number]', age);
// Should throw TypeError with the given description
// Variable: age
// Expected type: [Number]
// Error value type: [Undefined]
// Error value: undefined
 * @example
const options = {
  showHidden: true, // customizing the output.
  compact: false,
}
const value  = {
  someProp: ()=>{
    console.log("Hello reader, how are you? I'm alright.");
  }
}
throwTypeErrorFromTemplate('value', '[Number]',value, options);
// TypeError:
//
// Variable: value
// Expected type: [Number]
// Error value type: [Object]
// Error value: {
//   someProp: [Function: someProp] {
//     [length]: 0,
//     [name]: 'someProp'
//   }
// }
 */
export const throwTypeErrorFromTemplate =
(variableName, expectedType, value, logOptions = null) => {
  let options = {
    showHidden: false,
    compact: false,
    depth: 10,
    colors: true,
  };
  if (isObject(logOptions)) {
    options = logOptions;
  }
  const description = `\n
Variable: ${variableName}
Expected type: ${expectedType}
Error value type: [${getDataType(value)}] 
Error value: ${inspect(value, options)}`;

  throw new TypeError(description);
};
