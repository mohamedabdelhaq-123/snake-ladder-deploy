import Point from "../utils/point.js";

/**
 * Includes the data for a player's instance during gameplay
 * Separately from the GUI and other interfaces and uses the playerId
 * to allow cross referencing
 *
 * currently only contains position
 * @property {Number} playerId - the id for player for cross referencing with the gui and other interfaces
 * @property {Point} position - the starting position of the player
 * @property {Card} cards - the list of cards the player currently has
 */
export default class PlayerGameData {
	#playerId;
	#position;
	#cards = [];

	/**
	 * @param {Point} initialPosition optionally specifies starting position
	 */
	constructor(playerId,initialPosition) {
		// TODO: player id not validated
		this.#playerId = Number(playerId);
		if (initialPosition !== undefined){
			// using this.position instead of this.#position to trigger validation
			this.position = initialPosition;
		}
		else {
			this.position = new Point(0,0);
		}
	}

	toJson(){
		// initialize object to start saving data
		let playerData = new Object();

		// save ID
		playerData.playerId = this.playerId;

		// save Position
		let pos = this.position;
		playerData.position = {x:pos.x, y:pos.y};

		// save cards
		playerData.cards = [];
		this.cards.forEach((card)=>{
			// save card names instead of card object
			// TODO: move this to cards instead of being nested here
			playerData.cards.push(card.name);
		});
		return playerData;
	}

	static fromJson(playerData){

		let playerId = Number(playerData.playerId);
		// initialize object to start loading data
		let player = new PlayerGameData(playerId);

		// load Position
		let pos = playerData.position;
		player.position = new Point(Number(pos.x), Number(pos.y));

		// load cards
		player.cards.clear;
		playerData.cards.forEach((_card_name)=>{
			// TODO, load correct card type based on card name
			// card names are saved instead of card object
			// TODO: move this to cards instead of being nested here
			// code to implement that (it's almost 8, I need to be done)
		});
		return player;
	}

	get cards(){
		return this.#cards;
	}

	get position(){
		return this.#position;
	}

	set position(val){
		if (!(val instanceof Point)){
			throw new Error("Only accepts points!");
		}
		this.#position = val;
	}

	get playerId(){
		return this.#playerId;
	}
}
