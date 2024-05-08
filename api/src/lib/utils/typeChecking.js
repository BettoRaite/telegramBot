/**
 * Calls `Object.prototype.toString.call()` on passed in value, checks
 * whether it returns '[object Object]'.
 * @param {any} val any value.
 * @return {bool} Returns
 * a bool indicating whether `val` is of type object or not.
 */
export function isObject(val) {
	return Object.prototype.toString.call(val) == "[object Object]";
}

/**
 * Calls `Object.prototype.toString.call()` on passed in value.
 * @param {any} val any value.
 * @return {string} Returns a string representing the type of the `val`.
 */

export function getDataType(val) {
	return Object.prototype.toString.call(val).split(" ")?.at(1)?.slice(0, -1);
}
