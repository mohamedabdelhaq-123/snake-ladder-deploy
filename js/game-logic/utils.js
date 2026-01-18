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

/**
 * immutable point class with integer values and key function to allow converting it into a map key
 *
 * WARNING!!!: to use it in a map you must call the key() method because javascript
 * uses strict equality of references oherwise!
 * TODO: use a proxy to alter how maps work?
 */
export class Point {
	#x;
	#y;

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x,y) {
		if (!(isInt(x)&&isInt(y))){
			throw new Error("only integers allowed!");
		}
		this.#x = x;
		this.#y = y;
	}

	/** @override */
	toString(){
		this.key();
	}

	/**
	 * get point as string for map resoultion
	 * @returns Stringified key
	 */
	key(){
		return `(${this.#x},${this.#y})`;
	}

	get x(){
		return this.#x;
	}

	get y(){
		return this.#y;
	}

}

/**
 * A class used to handle cyclic nature of player turns
 */
export class CyclicQueue {
	// note data is returned as a whole instead of exposng some functions, thus can be manipulated
	#data = [];
	#index = 0;
	constructor() {}

	/**
	 * Moves the queue forward, cycling back when needed
	 */
	next(){
		this.#index=(this.#index+1)%this.#data.length;
	}

	/**
	 * Removes object from Queue while making sure the index remains valid.
	 * the new index will point at the next object in the queue
	 * @param {*} object
	 */
	remove(object){
		let i = this.#data.indexOf(object);
		this.#data.splice(i,1);

		//fix index in last edge case
		this.#index = this.#index%this.#data.length;
	}

	get data(){
		return this.#data;
	}

	get current(){
		return this.#data[this.#index];
	}

	get id(){
		return this.#index;
	}

	set id(val){
		//TODO: add validation
		this.#index = val;
	}
}