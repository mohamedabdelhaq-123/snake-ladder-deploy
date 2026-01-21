/**
 * Simple utils intended to be used by other modules
 */

/**
 * helper funtion to check if object is int while handling strings
 * @param {*} val
 */
export function isInt(val){
	return !isNaN(val) && Number.isInteger(Number(val));
}

/**
 *
 * @param {Number} max intger value
 */
export function diceRoll(max){
	if (!isInt(max)){
		throw new Error("only integers are allowed!");
	}

	// written to guarantee numbers end up in the range [1,max]
	return Math.floor(Math.random()*max)%max+1;
}

export function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}