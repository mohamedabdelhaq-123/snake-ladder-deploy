# Execution Flow Analysis: game-board.js (Middleware)

This file is the **bridge** between the HTML interface and the game logic. Let me break down what happens chronologically.

---

## 📥 PHASE 1: IMPORTS & CONSTANTS (Page Load Start)

```javascript
import { Game, Grid } from "../game-logic/game.js";
import { PortalTile } from "../game-logic/tiles.js";
import { diceRoll, Point } from "../game-logic/utils.js";
```

**What happens:** Loads the game engine classes we analyzed earlier.

---

```javascript
const ROLL_SIZE = 6;
const GRID_W = 10;
const GRID_H = 10;
```

**Translation:** 
- Dice has 6 sides
- Board is 10×10 (100 squares)

---

## 🎮 PHASE 2: GAME INITIALIZATION (Page Load)

### Step 1: Get Player Names
```javascript
const players = ["Momo", "ZoZ", "Andrew", "Haneen"];
```

**Translation:** "These are the 4 people playing."  
**Note:** In your final project, this should come from the home page (localStorage/URL params).

---

### Step 2: Create Player IDs
```javascript
const playerIds = [];
for (let i in players) {
    playerIds.push(i);
}
```

**What happens:**
```javascript
// Loop through players array
i = "0" → playerIds.push("0")
i = "1" → playerIds.push("1")
i = "2" → playerIds.push("2")
i = "3" → playerIds.push("3")

// Result:
playerIds = ["0", "1", "2", "3"]
```

**Important:** `for...in` returns **strings** ("0", "1"...), not numbers!

---

### Step 3: Create Game Board
```javascript
let grid = new Grid(GRID_W, GRID_H);
```

**Translation:** "Create a 10×10 game board."

---

### Step 4: (Optional) Add Snakes/Ladders
```javascript
// grid.addTile(new PortalTile(new Point(2,3), new Point(0,0)));
// grid.addTile(new PortalTile(new Point(1,3), new Point(0,0)));
```

**Translation:** "These lines are commented out, but this is where you'd add snakes/ladders."  
**Your TODO:** Uncomment and add all snakes/ladders from your board image.

---

### Step 5: Create Game Instance
```javascript
let game = new Game(playerIds, grid);
```

**What happens internally:**
1. Creates 4 PlayerGameData objects (IDs: 0, 1, 2, 3)
2. Sets turn order: [0, 1, 2, 3]
3. All players start at position (0, 0)

---

## 🎯 PHASE 3: DOM REFERENCES (Grabbing HTML Elements)

### Static Elements (Already in HTML)
```javascript
const rollButton = document.getElementById("rollDiceButton");
const diceImage = document.getElementById("diceIcon");
const activeTurnDisplay = document.getElementById("activeTurnPlayerName");
```

**Translation:** "Find these elements in the HTML so I can control them."

---

### Containers (Where we'll add dynamic content)
```javascript
const leaderboardContainer = document.getElementById("playersLeaderboard");
const logContainer = document.getElementById("gameLogPlayersList");
const playerMarkerContainer = document.getElementById("playerMarkerContainer");
```

**Purpose:** These are the "parent" boxes where we'll insert player cards, logs, and markers.

---

### Templates (Blueprints for cloning)
```javascript
const cardTemplate = document.getElementById("playerInfo");
const logTemplate = document.getElementById("gameLogPlayers");
const playerMarkerTemplate = document.getElementById("playerMarker");
```

**Translation:** "Get the HTML templates from the page so I can clone them for each player."

---

## 📦 PHASE 4: UI STORAGE ARRAYS

```javascript
const uiSquareValues = [];      // Stores <span> "Square 1" text elements
const uiCardContainers = [];    // Stores player card <div> containers
const uiLogs = [];              // Stores game log <li> elements
const uiPlayerMarkers = [];     // Stores player marker <img> elements
```

**Why arrays?**
- Fast access by player ID: `uiSquareValues[0]` = Player 0's square text
- No need to query DOM repeatedly (faster performance)
- Index matches player ID

**Visual:**
```
Player 0 (Momo):
  ├─ uiCardContainers[0]  → Leaderboard card
  ├─ uiSquareValues[0]    → "Square 1" text
  ├─ uiLogs[0]            → "Momo rolled a 0..."
  └─ uiPlayerMarkers[0]   → Player icon on board
```

---

## 🏗️ PHASE 5: INITIALIZATION FUNCTION (Runs Immediately)

```javascript
function setUpPlayers() {
```

This function runs **once** when the page loads. Let me break it down step-by-step:

---

### Step 1: Clear Containers
```javascript
leaderboardContainer.innerHTML = "";
logContainer.innerHTML = "";
```

**Translation:** "Delete any existing content (useful for game resets)."

---

### Step 2: Loop Through Each Player
```javascript
players.forEach((name, index) => {
```

**Runs 4 times:** index = 0, 1, 2, 3

---

### Step 3A: Create Leaderboard Card

```javascript
const cardFragment = cardTemplate.content.cloneNode(true);
```

**Translation:** "Clone the playerInfo template from HTML."

**What we're cloning:**
```html
<div class="playerInfo">
    <h5>Player i</h5>
    <span class="playerPostionSquareNumber">
        <p><span class="currentPlayerSquareNumber">Square 1</span></p>
    </span>
</div>
```

---

```javascript
const cardContainer = cardFragment.firstElementChild;
const nameHeading = cardFragment.querySelector("h5");
const positionSpan = cardFragment.querySelector(".currentPlayerSquareNumber");
```

**Translation:** "Grab references to specific parts of the cloned card."

---

```javascript
nameHeading.textContent = name;
positionSpan.textContent = "Square 1";
```

**Example for Player 0 (Momo):**
```html
<h5>Momo</h5>  <!-- Changed from "Player i" -->
<span>Square 1</span>
```

---

```javascript
if (index === 0) {
    cardContainer.classList.add("PickedPlayerTurn");
}
```

**Translation:** "Highlight the first player's card (it's their turn)."

**CSS Effect:** Adds a visual highlight class to Player 0's card.

---

```javascript
uiCardContainers.push(cardContainer);
uiSquareValues.push(positionSpan);
leaderboardContainer.appendChild(cardFragment);
```

**Translation:**
1. Save references to the card and square text
2. Add the card to the leaderboard on the page

**After all 4 players:**
```javascript
uiCardContainers = [card0, card1, card2, card3]
uiSquareValues = [span0, span1, span2, span3]
```

---

### Step 3B: Create Player Markers (Board Icons)

```javascript
const markerFragment = playerMarkerTemplate.content.cloneNode(true);
const markerItem = markerFragment.firstElementChild;
```

**Translation:** "Clone the player marker image template."

**What we're cloning:**
```html
<img src="game-icon.jpg" style="position: absolute; width: 60px; height: 60px;">
```

---

```javascript
uiPlayerMarkers.push(markerItem);
playerMarkerContainer.appendChild(markerFragment);
```

**Translation:**
1. Save reference to this marker
2. Add it to the board (positioned later)

**After all 4 players:**
```javascript
uiPlayerMarkers = [img0, img1, img2, img3]
```

---

### Step 3C: Create Game Log Entries

```javascript
const logFragment = logTemplate.content.cloneNode(true);
const logItem = logFragment.firstElementChild;
```

**Translation:** "Clone the game log template."

---

```javascript
logItem.textContent = `${name} rolled a 0 and moved to Square 1`;
```

**Example:**
```
Momo rolled a 0 and moved to Square 1
```

---

```javascript
uiLogs.push(logItem);
logContainer.appendChild(logFragment);
```

**Translation:**
1. Save reference to this log entry
2. Add it to the game log list

---

### Step 4: Position All Markers
```javascript
players.forEach((_, index) => {
    updateMarkerPosition(index, true);
});
```

**Translation:** "Place all 4 player markers at the starting square (0, 0)."

---

### Step 5: Set Initial Turn Display
```javascript
updateTurnDisplay();
```

**What it does:**
```javascript
activeTurnDisplay.textContent = `${players[game.current]}'s Turn`;
// Result: "Momo's Turn"
```

---

### setUpPlayers() Executes Immediately
```javascript
setUpPlayers();
```

**Translation:** "Run all the setup as soon as the page loads."

---

## 📍 HELPER FUNCTION: updateMarkerPosition()

```javascript
function updateMarkerPosition(index, instant = false) {
```

**Purpose:** Positions a player's marker image on the board.

---

### Step 1: Get Player Position
```javascript
const pos = game.players.get(game.current).position;
```

**Example:** `pos = Point(3, 2)` means column 3, row 2

---

### Step 2: Flip Y-Axis (Board Starts at Bottom)
```javascript
const yIndex = (GRID_H - pos.y - 1);
```

**Why?**
- Game logic: Row 0 is at the bottom
- HTML: Row 0 is at the top
- Need to flip it

**Example:**
```javascript
pos.y = 2
yIndex = (10 - 2 - 1) = 7  // Flip it
```

---

### Step 3: Handle Snake Pattern (Alternating Rows)
```javascript
let xIndex = pos.x;
if (pos.y % 2 !== 0) {
    xIndex = (GRID_W - pos.x - 1);
}
```

**Why?**
Real snake & ladders boards zigzag:
```
Row 2: [20]→[21]→[22]→[23]  (left to right)
Row 1: [19]←[18]←[17]←[16]  (right to left, FLIPPED!)
Row 0: [0]→[1]→[2]→[3]      (left to right)
```

**Example:**
```javascript
// Odd row (row 1):
pos.y = 1 (odd)
pos.x = 2
xIndex = (10 - 2 - 1) = 7  // Flip horizontally

// Even row (row 2):
pos.y = 2 (even)
pos.x = 2
xIndex = 2  // Don't flip
```

---

### Step 4: Convert to Pixels
```javascript
const xPx = xIndex * 80 + 10;
const yPx = yIndex * 80 + 10;
```

**Math:**
- Each square is 80px × 80px
- Add 10px offset to center the marker

**Example:**
```javascript
xIndex = 3
xPx = 3 * 80 + 10 = 250px

yIndex = 7
yPx = 7 * 80 + 10 = 570px
```

---

### Step 5: Apply Position
```javascript
uiPlayerMarkers[index].style.left = `${xPx}px`;
uiPlayerMarkers[index].style.top = `${yPx}px`;
```

**Translation:** "Move the player marker image to these pixel coordinates."

---

## 🔄 HELPER FUNCTION: updatePositionsUI()

```javascript
function updatePositionsUI(result) {
```

**Purpose:** Updates all visual elements after a dice roll.

**Called by:** The roll button click handler (we'll see below)

---

### Step 1: Move Player in Game Logic
```javascript
let effects = game.advancePlayer(game.current, result);
```

**What happens:**
1. Gets current player's data
2. Calls `grid.advance()` to calculate new position
3. Returns any tile they landed on (snake/ladder)

**Example:**
```javascript
// Player at square 23, rolls 5
effects = grid.advance(player, 5)
// Player now at square 28
// If square 28 has a snake: effects = SnakeTile
```

---

### Step 2: Update Marker Position
```javascript
updateMarkerPosition(game.current);
```

**Translation:** "Move the player's icon to their new square on the board."

---

### Step 3: Trigger Tile Effects (Snake/Ladder)
```javascript
game.processEffects(game.current, effects);
```

**What happens:**
- If `effects` is a SnakeTile → Player slides down
- If `effects` is a LadderTile → Player climbs up
- If `effects` is undefined → Nothing happens

---

### Step 4: Update Marker Again (After Effect)
```javascript
updateMarkerPosition(game.current);
```

**Why twice?**
1. First update: Shows landing square
2. Snake/ladder effect moves them
3. Second update: Shows final position after effect

**Example:**
```
Land on square 28 → updateMarker (show square 28)
Square 28 has a snake → processEffects (move to square 5)
Update marker again → updateMarker (show square 5)
```

---

### Step 5: Calculate Display Square Number
```javascript
let pos = game.players.get(game.current).position;
let distance = pos.y * GRID_W + pos.x + 1;
```

**Why `+1`?**
- Game logic: Squares 0-99
- Display: Squares 1-100 (user-friendly)

**Example:**
```javascript
pos = Point(5, 3)
distance = 3 * 10 + 5 + 1 = 36
// Show "Square 36" to user
```

---

### Step 6: Update Leaderboard Text
```javascript
uiSquareValues[game.current].textContent = `Square ${distance}`;
```

**Example:**
```html
<!-- Before: -->
<span>Square 23</span>

<!-- After: -->
<span>Square 36</span>
```

---

### Step 7: Update Game Log
```javascript
uiLogs[game.current].textContent = `${players[game.current]} rolled a ${result} and moved to Square ${distance}`;
```

**Example:**
```
Momo rolled a 5 and moved to Square 36
```

---

## 🎨 HELPER FUNCTION: activePlayerLeaderboardHighlight()

```javascript
function activePlayerLeaderboardHighlight() {
```

**Purpose:** Switches the visual highlight to the next player.

---

### Step 1: Remove Highlight from Current Player
```javascript
uiCardContainers[game.current].classList.remove("PickedPlayerTurn");
```

**Translation:** "Remove the yellow/highlighted border from the player who just moved."

---

### Step 2: Switch to Next Player
```javascript
game.updateQueues();
```

**What happens internally:**
1. Check if current player won
2. If won: Move them to winQueue
3. If not: Call `activeQueue.next()` → Move to next player

**Example:**
```javascript
// Before:
game.current = 0 (Momo's turn)

// After updateQueues():
game.current = 1 (ZoZ's turn)
```

---

### Step 3: Highlight New Player
```javascript
uiCardContainers[game.current].classList.add("PickedPlayerTurn");
```

**Translation:** "Add the highlight border to the new current player's card."

---

### Step 4: Update Turn Text
```javascript
updateTurnDisplay();
```

**Updates:**
```javascript
activeTurnDisplay.textContent = "ZoZ's Turn"
```

---

## 🎲 MAIN EVENT: ROLL DICE BUTTON CLICK

```javascript
rollButton.addEventListener("click", () => {
```

**This is what happens when the user clicks "Roll Dice"!**

---

### Step 1: Check if Game is Over
```javascript
if (game.winQueue.length > 0) { return; }
```

**Translation:** "If someone has won, don't allow more rolls."

**Example:**
```javascript
winQueue = [2]  // Player 2 won
// Click does nothing, game is over
```

---

### Step 2: Disable Button (Prevent Double-Clicks)
```javascript
rollButton.disabled = true;
```

**Translation:** "Gray out the button so user can't click it again during animation."

---

### Step 3: Show Dice Animation
```javascript
diceImage.src = "../assets/images/dice-animation.gif";
```

**Translation:** "Replace the static dice image with an animated GIF (rolling dice)."

---

### Step 4: Roll the Dice
```javascript
let result = diceRoll(ROLL_SIZE);
```

**Example:**
```javascript
result = 4  // Random number 1-6
```

---

### Step 5: Wait 1 Second, Then Update Everything
```javascript
setTimeout(() => {
```

**Translation:** "Wait 1000 milliseconds (1 second) for the animation to play, then..."

---

```javascript
diceImage.src = `../assets/images/dice-${result}.png`;
```

**Translation:** "Show the final dice face (e.g., dice-4.png)."

---

```javascript
updatePositionsUI(result);
```

**What happens:**
1. Move player forward `result` squares
2. Update marker position
3. Trigger snake/ladder effect
4. Update leaderboard text
5. Update game log

---

```javascript
activePlayerLeaderboardHighlight();
```

**What happens:**
1. Remove highlight from current player
2. Check if they won
3. Switch to next player
4. Highlight new player

---

```javascript
rollButton.disabled = false;
```

**Translation:** "Re-enable the button so the next player can roll."

---

```javascript
}, 1000);
```

**Translation:** "All of this happens 1 second after the button click."

---

## 🔄 COMPLETE EXECUTION FLOW DIAGRAM

```
═══════════════════════════════════════════════════════════
PAGE LOADS
═══════════════════════════════════════════════════════════
1. Import classes (Game, Grid, etc.)
2. Set constants (ROLL_SIZE=6, GRID_W=10, GRID_H=10)
3. Get player names ["Momo", "ZoZ", "Andrew", "Haneen"]
4. Create playerIds [0, 1, 2, 3]
5. Create grid (10×10 board)
6. Create game instance
7. Get DOM element references (buttons, containers, templates)
8. Run setUpPlayers():
   ├─ Clone 4 leaderboard cards → Add to page
   ├─ Clone 4 player markers → Add to board
   ├─ Clone 4 log entries → Add to log
   ├─ Position all markers at square 0
   └─ Set turn display to "Momo's Turn"

═══════════════════════════════════════════════════════════
USER CLICKS "ROLL DICE"
═══════════════════════════════════════════════════════════
1. Check if game over → If yes, do nothing
2. Disable roll button
3. Show dice animation GIF
4. Roll dice (get random 1-6)
5. Wait 1 second...
6. Show final dice face image
7. updatePositionsUI(result):
   ├─ game.advancePlayer() → Move player in logic
   ├─ updateMarkerPosition() → Show new position
   ├─ game.processEffects() → Trigger snake/ladder
   ├─ updateMarkerPosition() → Show final position
   ├─ Update leaderboard "Square X" text
   └─ Update log "Player rolled X and moved to Square Y"
8. activePlayerLeaderboardHighlight():
   ├─ Remove highlight from current player
   ├─ game.updateQueues() → Check win & switch turn
   ├─ Highlight new player
   └─ Update turn display "Player's Turn"
9. Re-enable roll button

═══════════════════════════════════════════════════════════
NEXT PLAYER'S TURN (Repeat from "USER CLICKS")
═══════════════════════════════════════════════════════════
```

---

## 🧠 KEY CONNECTIONS: HTML ↔ JS ↔ Game Logic

```
┌─────────────────────────────────────────────────────┐
│                   HTML LAYER                        │
│  • Button, Images, Containers                       │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│              MIDDLEWARE (game-board.js)             │
│  • Listens to button clicks                         │
│  • Updates visual elements (images, text)           │
│  • Calls game logic methods                         │
│  • Stores UI references in arrays                   │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│              GAME LOGIC (game.js)                   │
│  • Game class (manages turns, winners)              │
│  • Grid class (handles movement)                    │
│  • PlayerGameData (stores positions)                │
└─────────────────────────────────────────────────────┘
```

---

## 💡 CRITICAL UNDERSTANDING POINTS

### 1. **Arrays for Fast Access**
```javascript
// Instead of:
document.querySelector(`#player${id}-square`).textContent = "Square 5";

// We use:
uiSquareValues[id].textContent = "Square 5";
// Much faster! No DOM searching
```

---

### 2. **Template Cloning**
```javascript
// Templates are blueprints - we clone them for each player
const clone = template.content.cloneNode(true);
// Now we have a fresh copy to customize
```

---

### 3. **Separation of Concerns**
- **game-board.js** = Visual updates only
- **game.js** = Game rules and logic only
- They communicate through method calls

---

### 4. **The Flow of a Turn**
```
User clicks → Animation plays → Game logic updates → 
Visual updates → Turn switches → Next player's turn
```

---

## 📝 YOUR TODO LIST (What's Missing)

1. **Add Snakes/Ladders:**
```javascript
// Uncomment and add all tiles:
grid.addTile(new PortalTile(new Point(16, 0), new Point(6, 0)));  // Snake from 16 to 6
grid.addTile(new PortalTile(new Point(4, 0), new Point(14, 0)));  // Ladder from 4 to 14
// ... add all from your board image
```

2. **Get Players from Home Page:**
```javascript
// Replace hardcoded array with:
const players = JSON.parse(localStorage.getItem('players')) || ["Player 1"];
```

3. **Handle Win Condition:**
```javascript
// After updatePositionsUI(), check:
if (game.winQueue.length > 0) {
    alert(`${players[game.winQueue[0]]} wins!`);
    // Navigate to leaderboard page
}
```

4. **Add Animation:**
```javascript
// In updateMarkerPosition(), add smooth transitions
uiPlayerMarkers[index].style.transition = "all 0.5s ease";
```

---
