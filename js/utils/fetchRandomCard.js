
import { allCards, numberToCard } from "../game-logic/all-cards.js";
import { diceRoll } from "./utils.js";
/**
 * simply gets you a random card by using math.random.
 *
 */


export function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomCard() {
	let randomIndex = diceRoll(allCards.length)-1;
	return numberToCard(randomIndex);
}
