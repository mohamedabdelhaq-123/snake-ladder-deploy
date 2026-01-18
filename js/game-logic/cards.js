import { Point } from "./utils.js";
import { Game, PlayerGameData } from "./game.js";

/**
 * Tiles are special entities placed on the board
 * which trigger an event of some sort when the player presses on them
 */
export class Card {
	constructor() {}

	/**
	 * A function intended to be applied when the tile is pressed on
	 * @param {Game} game game state to affect
	 * @param {PlayerGameData} player the player who stepped on it
	 * @param {*} params extra parameters like the other player for example
	 */
	effect(_game,_player,_params) {}

	/**
	 * returns description about tiles for displaying in game
	 */
	get name(){
		return "card";
	}

}

/**
 * Parent class for any card that sends the player an amount in a direction
 * such as snakes or ladders
 * @augments Card
 */
export class JumpCard extends Card {
	#amount;
	/**
	 * @param {number} amount
	 */
	constructor(amount) {
		//TODO: validate
		this.#amount= amount;
	}

	/**
	 * @override
	 */
	get name(){
		return `Jump ${this.#amount}`;
	}

	/**
	 * sends player (amount) steps back
	 * @inheritdoc
	 * @override
	 * @param {Game} game game state to affect
	 * @param {PlayerGameData} _player the player who activated the card
	 * @param {number} other other player id
	 */
	effect(game,_player,other) {
		// Note: this relies on Points being immutable
		// otherwise we should copy data firs
		// TODO: confirm if this is fine
		game.advancePlayer(other,this.#amount);
	}
}
