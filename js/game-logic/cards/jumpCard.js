import Card from "../cards.js";

/**
 * Parent class for any card that sends the player an amount in a direction
 * such as snakes or ladders
 * @augments Card
 */
export default class JumpCard extends Card {
	#amount;
	/**
	 * @param {number} amount
	 */
	constructor(amount) {
		//TODO: validate
		super();
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
	effect(game,player,other) {
		// Note: this relies on Points being immutable
		// otherwise we should copy data first
		// TODO: confirm if this is fine

		// if no other, assume this means it's me
		if (!other){
			other = player.playerId;
		}
		const effects = game.advancePlayer(other,this.#amount);
		game.processEffects(other,effects);
	}
}
