import Card from "../cards.js";
import Point from "../../utils/point.js";
/**
 * Parent class for any card that that swaps the next player postion
 * such as snakes or ladders
 * @augments Card
 */
export default class SwapCard extends Card {
 
  constructor() {
    //TODO: validate
    super();
  }

  /**
   * @override
   */
  get name(){
    return `Swap`;
  }

  /**
   * swap two players 
   * @inheritdoc
   * @override
   * @param {Game} game game state to affect
   * @param {PlayerGameData} _player the player who activated the card
   * @param {number} other other player id
   */
  effect(game,player,other) {
    
    let playerID = game.current;
    let targetID = game.nextPlayer;
    
    let tempTargetPos = game.players.get(targetID).position;
    let tempPlayerPos = game.players.get(playerID).position;

    game.players.get(targetID).position = new Point(tempPlayerPos.x,tempPlayerPos.y);
    game.players.get(playerID).position = new Point(tempTargetPos.x,tempTargetPos.y);

    
  

  }
}
