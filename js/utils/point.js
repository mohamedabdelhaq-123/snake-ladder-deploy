import { isInt } from "./utils.js";

/**
 * immutable point class with integer values and key function to allow converting it into a map key
 *
 * WARNING!!!: to use it in a map you must call the key() method because javascript
 * uses strict equality of references oherwise!
 * TODO: use a proxy to alter how maps work?
 */
export default class Point {
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