import PlayerGameData from "./player.js";
import Tile from "./tiles.js";
import CyclicQueue from "../utils/cyclicQueue.js";
import { diceRoll } from "../utils/utils.js";
import Point from "../utils/point.js";

/**
 * Class containing the game state as well as game logic
 * @property {Map} players - game data about players such as location
 * @property {Grid} grid - the tilemap the players are moving on
 * @property {CyclicQueue} activeQueue - keeps track of player play order
 * @property {array} winQueu - keeps track of order of players who won
 */
export default class Game {
	/**@type {Map<number,PlayerGameData>} */
	#players = new Map();

	/**@type {Grid} */
	#grid;            /* game board */

	/**@type {CyclicQueue<number>} */
	#activeQueue = new CyclicQueue();  /* track whose turn it is 1,2,3,1,2,3,.... */

	/**@type {Array<number>} */
	#winQueue = [];               /* 3,1,2 ==> player 3 reached 100 then player 1,... */

	//Challenges
	#shufflOnRoundEnd;
	#noOverlap;

	constructor(playerIds,grid,shufflOnRoundEnd,noOverlap) {
		// TODO: add validation for parameters
		this.#shufflOnRoundEnd = shufflOnRoundEnd;
		this.#noOverlap= noOverlap;
		let queueData = this.#activeQueue.data;  /* take direct access to turn order (to add player simply)*/

		playerIds.forEach((playerId)=>{
			this.#players.set(playerId,new PlayerGameData(playerId)); /* key(id),,value(obj(id,position [will be undef==>(0,0)] ) */
			queueData.push(playerId);
		});

		this.#grid = grid;
	}

	/**
	 * used to store object in json format
	 * note this is different to toJSON (capital JSON)
	 * @returns Json object
	 */
	toJson(){
		let gameState = new Object();

		//save win queue
		gameState.winQueue = this.winQueue; // save array data

		// save active queue
		gameState.activeQueue = this.activeQueue; // save array data
		gameState.activeIndex = this.#activeQueue.id; // save array index

		// save nested data
		gameState.players = [];
		this.players.forEach((player)=>{
			// return saved object (push to array)
			gameState.players.push(player.toJson());
		});

		return JSON.stringify(gameState);
	}

	/**
	 * used to initialize state from json
	 * note this is different to fromJSON (capital JSON)
	 * @param {Object} json
	 */
	fromJson(json){
		let gameState = JSON.parse(json);

		this.#winQueue = gameState.winQueue;

		// fill active queue
		this.#activeQueue.data.length=0; // clear array apparently
		this.#activeQueue.data.push(...gameState.activeQueue);
		this.#activeQueue.id = gameState.activeIndex;

		// load nested data
		this.#players.clear();
		gameState.players.forEach((playerData)=>{
			// return saved object (push to array)
			let player = PlayerGameData.fromJson(playerData);
			this.#players.set(Number(player.playerId),player);
		});
	}

	/**
	 * consumes card from player's inventory and triggers its effect
	 * @param {number} playerId id of Player playing the card
	 * @param {number} cardId id of card being played
	 * @param {*} params any other parameters the card requires
	 */
	playCard(playerId,cardId,params){
		let player = this.#players.get(playerId);
		let card = player.cards[cardId];
		player.cards.splice(cardId,1);
		card.effect(this,player,params);
	}

	/**
	 * Processes the effects cause by a player's movement
	 * @param {number} playerId
	 * @param {*} effects
	 */
	processEffects(playerId,effects){
		let player = this.#players.get(playerId);
		// handle effects
		if (effects instanceof Tile){
			effects.effect(this,player);
		}

		// enforce no overlap if applicable
		if (this.#noOverlap){
			this.enforceNoOverlap(player);
		}

	}

	/**
	 * sends all but the last player to a checkpoint (currenly 0,0)
	 * @param {PlayerGameData} player
	 */
	enforceNoOverlap(player){
		this.#players.forEach(otherPlayer => {
			// if players are overlapping anywhere but the start
			if (
				player!==otherPlayer&&
				player.position.key()===otherPlayer.position.key()&&
				player.position.key()!==(new Point(0,0)).key()
			){
				// send to checkpoint (currentl 0,0)
				otherPlayer.position = new Point(0,0);
			}
		});
	}

	/**
	 * Adances the current player forward on the board
	 * @param {number} result
	 * @returns effects triggered due to advancement
	 */
	advancePlayer(playerId,result){
		let player = this.#players.get(playerId);
		return this.#grid.advance(player,result);
	}

	removePlayerFromActiveQueue(playerId){
		this.#activeQueue.remove(playerId);
	}

	/**
	 * updates the active and winning queue
	 */
	updateQueues(){
		let last_index = this.#activeQueue.id;
		let anyWins = false;
		this.#activeQueue.data.forEach((playerId)=>{
			let player = this.#players.get(playerId);
			let hasWon = this.checkWinCondition(player);
			anyWins|=hasWon;
			// process turn result
			if (hasWon){ /* if was true */
				this.#activeQueue.remove(playerId);
				this.#winQueue.push(playerId);
			}
		});

		//TODO the logic here is faulty, revise it
		if (!anyWins) {
			this.#activeQueue.next(); /* if no one won so go to the second turn */
		}

		// if index got smaller then new round started
		// TODO: check if logic holds up
		if (this.#shufflOnRoundEnd && this.#activeQueue.id<last_index){
			// simple (but biased) shuffle
			this.#activeQueue.data.sort(() => Math.random() - 0.5);
		}
	}

	/**
	 * Plays an entire turn from start to finish:
	 * - rolls dice
	 * - advances player
	 * - process tile effects
	 * - updates queues
	 *
	 * note: this doesn't include playing cards
	 */
	playTurn(){
		// TODO: declare constant somewhere else (or make it dynamic)
		const DICE_SIDE_COUNT = 6;

		// roll dice
		let result = diceRoll(DICE_SIDE_COUNT);

		// advance player
		let effects = this.advancePlayer(this.current,result); /* this.current = this.#activeQueue.current; */

		// process roll result
		this.processEffects(this.current,effects);

		// check win condition & switch turns
		this.updateQueues();

	}

	/**
	 * Check if player has won this game
	 * @param {PlayerGameData} player
	 * @returns
	 */
	checkWinCondition(player){
		// note that we need to use key function to check equality
		return player.position.key() === this.#grid.goal.key();
	}

	/**
	 * returns a copy of the winQueue
	 */
	get winQueue(){
		return this.#winQueue.slice();
	}

	/**
	 * returns a copy of the activeQueue
	 */
	get activeQueue(){
		return this.#activeQueue.data.slice();
	}

	get current(){
		return this.#activeQueue.current;
	}

	get nextPlayer(){

		let nextIndex = (this.#activeQueue.id+1)%this.#activeQueue.data.length;
		return this.#activeQueue.data[nextIndex];
	}

	//TODO: make more restrictive, used this way for debugging purposes
	get players(){
		return this.#players;
	}

	// TODO: add other getters
}