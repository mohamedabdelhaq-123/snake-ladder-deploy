
/**
 * A class used to handle cyclic nature of player turns
 */
export default class CyclicQueue {
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