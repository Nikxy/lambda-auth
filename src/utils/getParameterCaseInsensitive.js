/**
 * @param {Object} object
 * @param {string} key
 * @return {any} value
 */
export default function (object, key) {
	const asLowercase = key.toLowerCase();
	return object[
		Object.keys(object).find((k) => k.toLowerCase() === asLowercase)
	];
}
