/** Generates a `TypeError` from a description template and throws it.
 * @param {string} variableName A variable name.
 * @param {string} expectedType An expected data type of the variable.
 * @param {any} value The actual of a variable.
 * @return {void}
 * @throws {TypeError} Throws a generated `TypeError`
 * from a description template.
 * @example
 * const age = undefined;
 * throwTypeErrorFromTemplate('age', 'a number', age);
 * // Should throw TypeError with the given description
 * 'age was expected to be a number, instead got this: undefined'
 */
export const throwTypeErrorFromTemplate = (variableName, expectedType, value)=>{
  // eslint-disable-next-line max-len
  const valueJSON = convertToJSON(value);
  // eslint-disable-next-line max-len
  const description = `variable: ${variableName} was expected to be ${expectedType}, instead got this: ${valueJSON}`;
  throw new TypeError(description);
};

/** A custom conversion for `JSON.stringify`
 * @param {any} key Any value.
 * @param {any} value Any value.
 * @return {value} if `value` is of data type:
 * undefined returns 'undefined'
 * function  returns 'function'
 * bigint    returns 'bigint'
 */
const replacer = (key, value) => {
  if (typeof value === 'function') return 'function';
  if (typeof value === 'bigint') return 'bigint';
  if (typeof value === 'undefined') return 'undefined';
  return value;
};

export const convertToJSON = (valueToJSON) => {
  if (valueToJSON instanceof Map) {
    const obj = {};
    for (const [key, value] of valueToJSON.entries()) {
      const keyJSON = JSON.stringify(key, replacer);
      obj[keyJSON] = value;
    }
    valueToJSON = obj;
  }
  if (valueToJSON instanceof Set) {
    return JSON.stringify([...valueToJSON], replacer, 2);
  }

  return JSON.stringify(valueToJSON, replacer, 2);
};
