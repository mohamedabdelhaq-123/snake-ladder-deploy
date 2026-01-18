import { Game, Grid } from "./game.js";
import { PortalTile } from "./tiles.js";
import { Point } from "./utils.js";

let table = document.getElementById("table");

function addTableEntry(round,turn,current,data){
	let row = table.insertRow();

	let cell0 = row.insertCell();
	cell0.innerText= round;

	let cell1 = row.insertCell();
	cell1.innerText= turn;

	let cell2 = row.insertCell();
	cell2.innerText= current;

	data.forEach(player => {
		let celli = row.insertCell();
		let x = player.position.x;
		let y = player.position.y;
		let value =  `${x+y*WIDTH}`;
		celli.innerText = value;
		if (current===player.playerId){
			celli.classList.add("current");
		}
	});
}


//----------------------------------------------------------------------------
// init and run game

const WIDTH = 4;
const HEIGHT= 4;
let grid = new Grid(WIDTH,HEIGHT);

//TODO: shouldstart and end be reversed to make start optional
grid.addTile(new PortalTile(new Point(2,3),new Point(0,0)));
grid.addTile(new PortalTile(new Point(1,3),new Point(0,0)));

let game = new Game([0,1,2,3],grid);
let round = 1;
let turn = 0;

let interval = window.setInterval(() => {
	let current = game.current;
	game.playTurn();

	turn+=1;
	addTableEntry(round,turn,current,game.players.values());
	if (game.current<current){
		round+=1;
	}

	if (game.winQueue.length===3){
		window.clearInterval(interval);
	}
}, 100);