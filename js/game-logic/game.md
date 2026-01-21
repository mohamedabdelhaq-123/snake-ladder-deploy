# Visual Memory Blocks for game.js Classes

---

# Step-by-Step Learning Path for game.js

---

## 🎯 STEP 1: Start with **PlayerGameData** (Easiest)

**Why start here?**
- Simplest class
- Just a data container
- No complex logic
- Foundation for understanding the other classes

### What to understand:
```javascript
let player = new PlayerGameData(1);  // Create player with ID 1
player.position;  // Where is this player? (Point object)
player.cards;     // What cards does this player have? (Array)
```

**Key concept:** This is like a player's profile card in a board game - it just holds their info.

---

## 🎯 STEP 2: Move to **Grid** (Medium difficulty)

**Why second?**
- Now you understand what a "player" is
- Grid moves players around
- The `advance()` method is the trickiest part but crucial

### What to understand:

**2a) Simple parts first:**
```javascript
let grid = new Grid(10, 10);  // 10x10 board (100 squares)
grid.addTile(snakeTile, position);  // Add a snake at position
grid.getTile(position);  // What's at this position?
```

**2b) The tricky part - `advance()` method:**
```
Board Layout:        Flattened view:
[9][19][29]...       [90, 91, 92...]
[8][18][28]...   →   [80, 81, 82...]
[0][10][20]...       [0, 1, 2, 3...]

Player at position (3, 2) = square 23
Rolls a 5
New position = 23 + 5 = 28
Convert back: (8, 2)
```

**Focus on:** How the code converts 2D coordinates ↔ 1D distance

---

## 🎯 STEP 3: Finally **Game** (Most Complex)

**Why last?**
- Uses both PlayerGameData and Grid
- Orchestrates everything
- Multiple interconnected methods

### Break it down in this order:

**3a) INITIALIZATION (Easy)**
```javascript
constructor(playerIds, grid)
```
- Understand: How the game starts, how players are registered

**3b) SINGLE TURN FLOW (Medium)**
```javascript
playTurn() → calls:
  ├─ advancePlayer()
  ├─ processEffects()
  └─ updateQueues()
```
- **Read `playTurn()` first** - it's the roadmap
- Then read each method it calls in order

**3c) WIN LOGIC (Medium)**
```javascript
checkWinCondition()
updateQueues()
```
- Understand: How the game knows someone won
- How players are moved from "active" to "winner" list

**3d) GETTERS (Easy)**
```javascript
get current()
get players()
```
- These just return data, simplest part

---

## 📚 Reading Order Summary

```
START HERE ──────────────────────────────────> END HERE
    ↓                    ↓                         ↓
PlayerGameData  →      Grid       →            Game
    ↓                    ↓                         ↓
What is a          How players              How everything
player?            move on board            works together
```

---

---


## 📦 CLASS 1: Grid (The Game Board Manager)

```
┌─────────────────────────────────────────────────┐
│               GRID CLASS                        │
│  "Manages the game board and player movement"  │
├─────────────────────────────────────────────────┤
│                                                 │
│  🏗️ SETUP BLOCK                                │
│  • constructor(width, height)                   │
│  • addTile(tile, position)                      │
│  → Creates board, adds snakes/ladders           │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  🎯 MOVEMENT BLOCK                              │
│  • advance(player, amount)                      │
│  → Moves player forward, handles board wrapping │
│     (Uses math to flatten 2D → 1D → 2D)        │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔍 DATA ACCESS BLOCK                           │
│  • getTile(position)                            │
│  • get goal()                                   │
│  → Retrieves tiles and winning position         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Importance:** ⭐⭐⭐⭐⭐  
**Why:** Without Grid, players can't move. It's the foundation of the game board.

---

## 👤 CLASS 2: PlayerGameData (Individual Player Info)

```
┌─────────────────────────────────────────────────┐
│          PLAYERGAMEDATA CLASS                   │
│    "Stores one player's current game state"    │
├─────────────────────────────────────────────────┤
│                                                 │
│  📋 PLAYER STATE BLOCK                          │
│  • constructor(playerId, initialPosition)       │
│  • get playerId()                               │
│  • get/set position()                           │
│  • get cards()                                  │
│  → Tracks: Who is this? Where are they?         │
│            What cards do they have?             │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Importance:** ⭐⭐⭐⭐  
**Why:** Each player needs their own data container. This keeps Player 1's position separate from Player 2's.

---

## 🎮 CLASS 3: Game (The Game Engine - MOST IMPORTANT)

```
┌─────────────────────────────────────────────────────────┐
│                    GAME CLASS                           │
│         "The brain - controls entire game"             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🚀 INITIALIZATION BLOCK                                │
│  • constructor(playerIds, grid)                         │
│  → Sets up players, turn order, board                   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎲 TURN EXECUTION BLOCK (CORE GAMEPLAY)                │
│  • playTurn()          ← Main function!                 │
│  • advancePlayer(playerId, result)                      │
│  • processEffects(playerId, effects)                    │
│  → Handles: Roll → Move → Snake/Ladder effect           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🃏 CARD SYSTEM BLOCK                                   │
│  • playCard(playerId, cardId, params)                   │
│  → Uses special power-up cards                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏆 WIN DETECTION BLOCK                                 │
│  • checkWinCondition(player)                            │
│  • updateQueues()                                       │
│  → Checks if player won, switches turns                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 DATA ACCESS BLOCK                                   │
│  • get current()        ← Whose turn?                   │
│  • get players()                                        │
│  • get winQueue()                                       │
│  • get activeQueue()                                    │
│  → Lets UI see game state                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Importance:** ⭐⭐⭐⭐⭐⭐ (CRITICAL)  
**Why:** This IS the game. It orchestrates everything: turns, movement, winning, card effects.

---

## 🔗 How They Connect

```
      GAME (Boss)
         |
         |-- Uses --> GRID (to move players)
         |
         |-- Creates --> PLAYERGAMEDATA (one per player)
         |
         |-- Manages --> Turn order, win conditions
```

---

# Simple Explanation of `addTile()`

## What does this function do?
**Adds a special tile (like a snake or ladder) to a specific spot on the board.**

---

## Step-by-Step Breakdown

### **Step 1: Safety Check - Is it really a Tile?**
```javascript
if (!(tile instanceof Tile)){
    throw new Error("Only tiles are accepted!");
}
```
**Translation:** "If you didn't give me a Tile object, I'll throw an error and stop."

**Why?** Prevents bugs. Imagine trying to add a number or string instead of a proper Tile - the game would crash later.

---

### **Step 2: Optional Position Override**
```javascript
if (position !== undefined){
    if (!(position instanceof Point)){
        throw new Error("Only points are accepted!");
    }
    Tile.position = position;
}
```
**Translation:** 
- "Did you give me a custom position? If yes, I'll use it."
- "But first, let me check it's actually a Point object (not just random numbers)."

**Example:**
```javascript
// Tile already has position (5, 3)
let snake = new Tile(new Point(5, 3));

// But I want to move it to (7, 2) when adding
grid.addTile(snake, new Point(7, 2));  // Override position
```

---

### **Step 3: Check if something is already there**
```javascript
let temp = this.#tiles.get(tile.position.key());
```
**Translation:** "Before I add this tile, let me check if there's already a tile at this position."

**What's `.key()`?**
- Converts Point (x, y) to a string like "5,3"
- Maps use strings as keys, so `Point(5,3)` becomes `"5,3"`

**Example:**
```javascript
// If there's already a ladder at square (5, 3)
let oldTile = tiles.get("5,3");  // Save it in 'temp'
```

---

### **Step 4: Add the new tile**
```javascript
this.#tiles.set(tile.position.key(), tile);
```
**Translation:** "Now put the new tile on the board at its position."

**Example:**
```javascript
// Store: "5,3" → SnakeTile object
tiles.set("5,3", newSnakeTile);
```

---

### **Step 5: Return what was there before**
```javascript
return temp;
```
**Translation:** "Give back whatever tile was at that spot before (could be `undefined` if nothing was there)."

**Why return it?**
- So you can check: "Oh, I just replaced a ladder with a snake!"
- Or know: "That spot was empty, no problem."

---

## Real-World Example

```javascript
let grid = new Grid(10, 10);

// Add a snake at position (5, 3)
let snake = new SnakeTile(new Point(5, 3));
let oldTile = grid.addTile(snake);

console.log(oldTile);  // undefined (nothing was there)

// Later, accidentally add a ladder at the SAME spot
let ladder = new LadderTile(new Point(5, 3));
let replaced = grid.addTile(ladder);

console.log(replaced);  // Returns the snake we just replaced!
```

---


# Step-by-Step Breakdown of `advance()` Method in Grid Class

---

## 🎯 What does this function do?
**Moves a player forward on the board based on their dice roll.**

---

## 📐 The Big Picture: 2D Board → 1D Line → 2D Board

```
2D Board (10x10):          1D Line (0-99):
[90][91][92]...[99]   →    [90, 91, 92...99]
[80][81][82]...[89]   →    [80, 81, 82...89]
...                   →    ...
[0] [1] [2] ...[9]    →    [0, 1, 2...9]
```

**Why?** Easier to do math: "Move 5 squares forward" = just add 5!

---

## 🔢 STEP 1: Get Player's Current Position

```javascript
let x = player.position.x;
let y = player.position.y;
```

**Example:**
```javascript
// Player is at position (3, 2)
x = 3
y = 2
```

**Visual:**
```
Row 2: [20][21][22][23]...
                    ↑
               Player here (3, 2)
```

---

## 🔢 STEP 2: Convert 2D Position to 1D Distance

```javascript
let distance = x + y * this.#width;
```

**Formula:** `distance = x + (y × width)`

**Example with width = 10:**
```javascript
distance = 3 + (2 × 10)
distance = 3 + 20
distance = 23
```

**Translation:** "Player is at square number 23 on the flattened board."

**Visual:**
```
Flattened: [0][1][2]...[20][21][22][23][24]...
                                    ↑
                              Square 23
```

---

## 🔢 STEP 3: Add Dice Roll

```javascript
let newDistance = distance + amount;
```

**Example:** Player rolls a 5
```javascript
newDistance = 23 + 5
newDistance = 28
```

**Translation:** "Player moves from square 23 to square 28."

---

## 🔢 STEP 4: Boundary Check #1 - Prevent Going Over 99

```javascript
if (newDistance > 99) {
    newDistance = distance;
}
```

**Example:** Player at square 97, rolls 6
```javascript
newDistance = 97 + 6 = 103  // Over the limit!

// Fix it:
if (103 > 99) {
    newDistance = 97;  // Stay where you are
}
```

**Translation:** "If you'd go past square 99, don't move at all."

**Game Rule:** You must land exactly on square 99 to win (can't overshoot).

---

## 🔢 STEP 5: Boundary Check #2 - Safety Clamp

```javascript
newDistance = Math.max(0, Math.min(newDistance, this.#width * this.#height - 1));
```

**Breaking it down:**

```javascript
// this.#width * this.#height - 1
// = 10 × 10 - 1
// = 99 (last square)

Math.min(newDistance, 99)  // Can't go above 99
Math.max(0, result)        // Can't go below 0
```

**Example scenarios:**

| Scenario | newDistance | After Math.min(x, 99) | After Math.max(0, x) | Final |
|----------|-------------|----------------------|---------------------|-------|
| Normal   | 28          | 28                   | 28                  | 28    |
| Too high | 150         | 99                   | 99                  | 99    |
| Negative | -5          | -5                   | 0                   | 0     |

**Translation:** "Make sure the distance is between 0 and 99, no matter what."

---

## 🔢 STEP 6: Convert 1D Distance Back to 2D Position

```javascript
let newX = newDistance % this.#width;
let newY = Math.floor(newDistance / this.#width);
```

**Example with newDistance = 28, width = 10:**

### Calculate X (column):
```javascript
newX = 28 % 10
newX = 8
```
**Translation:** "28 divided by 10 leaves remainder 8" → Column 8

### Calculate Y (row):
```javascript
newY = Math.floor(28 / 10)
newY = Math.floor(2.8)
newY = 2
```
**Translation:** "28 divided by 10 is 2 (ignoring decimals)" → Row 2

**Result:** `(8, 2)` - Column 8, Row 2

**Visual:**
```
Row 2: [20][21][22][23][24][25][26][27][28][29]
                                            ↑
                                    Player lands here (8, 2)
```

---

## 🔢 STEP 7: Update Player's Position

```javascript
player.position = new Point(newX, newY);
```

**Example:**
```javascript
player.position = new Point(8, 2);
```

**Translation:** "Update the player's position object to their new location."

---

## 🔢 STEP 8: Return Any Tile at New Position

```javascript
return this.getTile(player.position);
```

**Translation:** "Check if there's a snake or ladder at this new position and return it."

**Returns:**
- `SnakeTile` object → Player landed on a snake
- `LadderTile` object → Player landed on a ladder  
- `undefined` → Normal square, no special tile

---

## 🎮 Complete Example Walkthrough

```javascript
// Setup
let grid = new Grid(10, 10);
let player = new PlayerGameData(1);
player.position = new Point(3, 2);  // Square 23

// Player rolls a 5
let tile = grid.advance(player, 5);

// What happens:
// 1. x = 3, y = 2
// 2. distance = 3 + (2 × 10) = 23
// 3. newDistance = 23 + 5 = 28
// 4. Check: 28 > 99? No, continue
// 5. Clamp: Math.max(0, Math.min(28, 99)) = 28
// 6. newX = 28 % 10 = 8
// 7. newY = floor(28 / 10) = 2
// 8. player.position = Point(8, 2)
// 9. Return getTile(8, 2) → might be a snake!
```

---

## 🧮 Why This Math Works

**The Modulo (%) Trick:**
```
Square 0-9   → Row 0 (y=0)
Square 10-19 → Row 1 (y=1)
Square 20-29 → Row 2 (y=2)
...

Square 28:
28 ÷ 10 = 2 remainder 8
So: Row 2, Column 8 ✓
```

**The Floor Division Trick:**
```
Any square 20-29 ÷ 10 = 2.something
floor(2.something) = 2 → Row 2 ✓
```

---

## 🎯 Summary in Simple Terms

1. **Where is player?** Get their (x, y) position
2. **Flatten it** Convert to single number (0-99)
3. **Add dice roll** Move forward
4. **Boundary checks** Don't go past 99 or below 0
5. **Unflatten it** Convert back to (x, y)
6. **Update player** Give them new position
7. **Check for tiles** Return snake/ladder if they landed on one

---


# ====>Breakdown of Game Class<=====

---

## 🏗️ PART 1: The Game's "Memory" (Properties)

Think of these as the game's notebook where it writes down everything.

```javascript
#players = new Map();
```
**What:** A dictionary of all players  
**Structure:** `{1: PlayerData, 2: PlayerData, 3: PlayerData}`  
**Example:** `players.get(1)` → Gets Player 1's data (position, cards)

---

```javascript
#grid;
```
**What:** The game board (10×10 grid with snakes/ladders)  
**Purpose:** Manages player movement and tile effects

---

```javascript
#activeQueue = new CyclicQueue();
```
**What:** The turn order line  
**Structure:** `[1, 2, 3, 1, 2, 3, ...]` (cycles forever)  
**Purpose:** Tracks whose turn it is

**Visual:**
```
Turn 1: Player 1 → Turn 2: Player 2 → Turn 3: Player 3 → Turn 4: Player 1 (cycles back)
```

---

```javascript
#winQueue = [];
```
**What:** List of winners in order  
**Structure:** `[3, 1, 2]` means Player 3 won first, Player 1 second, Player 2 third  
**Purpose:** Tracks finishing order for leaderboard

---

## 🚀 PART 2: Starting the Game (Constructor)

```javascript
constructor(playerIds, grid) {
```

### Input Example:
```javascript
let playerIds = [1, 2, 3];  // 3 players
let grid = new Grid(10, 10);  // 10×10 board

let game = new Game(playerIds, grid);
```

### Step-by-Step:

#### **Step 1: Get reference to the queue's internal array**
```javascript
let queueData = this.#activeQueue.data;
```
**Translation:** "Give me direct access to the turn order list so I can add players to it."

---

#### **Step 2: Loop through each player ID**
```javascript
playerIds.forEach((playerId) => {
```

**Example:** Loop runs 3 times for players 1, 2, 3

---

#### **Step 3: Create player data**
```javascript
this.#players.set(playerId, new PlayerGameData(playerId));
```

**What happens:**
```javascript
// Iteration 1:
players.set(1, new PlayerGameData(1));  // Create Player 1

// Iteration 2:
players.set(2, new PlayerGameData(2));  // Create Player 2

// Iteration 3:
players.set(3, new PlayerGameData(3));  // Create Player 3
```

**Result:** 
```javascript
#players = {
  1: PlayerGameData(position: (0,0), cards: []),
  2: PlayerGameData(position: (0,0), cards: []),
  3: PlayerGameData(position: (0,0), cards: [])
}
```

---

#### **Step 4: Add player to turn order**
```javascript
queueData.push(playerId);
```

**What happens:**
```javascript
// After all iterations:
activeQueue.data = [1, 2, 3]
```

**Translation:** "Turn order: Player 1 → Player 2 → Player 3 → (cycles back)"

---

#### **Step 5: Save the game board**
```javascript
this.#grid = grid;
```

**Translation:** "Remember which board we're playing on."

---

### Constructor Summary:
```
Input: [1, 2, 3] and Grid
↓
Creates: 3 PlayerGameData objects
↓
Sets up: Turn order [1, 2, 3]
↓
Saves: The game board
↓
Game is ready to play!
```

---

## 🎲 PART 3: Playing a Turn (The Most Important Method)

```javascript
playTurn() {
```

This is **THE CORE** of the entire game. Everything else supports this method.

### Step-by-Step:

#### **Step 1: Roll the dice**
```javascript
const DICE_SIDE_COUNT = 6;
let result = diceRoll(DICE_SIDE_COUNT);
```

**Example:**
```javascript
result = 4  // Player rolled a 4
```

---

#### **Step 2: Move the current player**
```javascript
let effects = this.advancePlayer(this.current, result);
```

**Breaking it down:**
```javascript
this.current  // Returns current player's ID (e.g., 1)
this.advancePlayer(1, 4)  // Move Player 1 forward 4 squares
```

**What `advancePlayer` does:**
1. Gets Player 1's data
2. Calls `grid.advance(player, 4)`
3. Returns any tile they landed on (snake/ladder/nothing)

**Example return values:**
```javascript
effects = SnakeTile object  // Landed on a snake!
effects = LadderTile object  // Landed on a ladder!
effects = undefined  // Normal square
```

---

#### **Step 3: Handle tile effects**
```javascript
this.processEffects(this.current, effects);
```

**What happens:**
- If `effects` is a Tile (snake/ladder), trigger its effect
- Snake: Moves player down
- Ladder: Moves player up

**Example:**
```javascript
// If player landed on a snake:
effects.effect(game, player);  // Snake moves player backwards
```

---

#### **Step 4: Check for winners and switch turns**
```javascript
this.updateQueues();
```

**Two things happen:**
1. Check if current player reached square 99 (won)
2. Move to next player's turn

---

### playTurn() Flow Diagram:
```
Click "Roll Dice"
       ↓
[1] Roll dice (e.g., 4)
       ↓
[2] Move player forward 4 squares
       ↓
[3] Did they land on snake/ladder?
       ↓ Yes               ↓ No
   Trigger effect      Do nothing
       ↓                   ↓
[4] Check if won → Update turn order
       ↓
Next player's turn
```

---

## 🏆 PART 4: Checking Winners (updateQueues)

```javascript
updateQueues() {
```

### Step-by-Step:

#### **Step 1: Initialize win tracker**
```javascript
let anyWins = false;
```
**Purpose:** Track if anyone won this round

---

#### **Step 2: Check every active player**
```javascript
this.#activeQueue.data.forEach((playerId) => {
```

**Example:** If `activeQueue = [1, 2, 3]`, check all 3 players

---

#### **Step 3: Get player data and check if they won**
```javascript
let player = this.#players.get(playerId);
let hasWon = this.checkWinCondition(player);
```

**What `checkWinCondition` does:**
```javascript
// Check if player's position equals goal (square 99)
player.position.key() === "9,9"  // Returns true/false
```

---

#### **Step 4: Track if anyone won**
```javascript
anyWins |= hasWon;
```

**Translation:** "If this player won, remember that someone won."

**The `|=` operator:**
```javascript
anyWins = anyWins || hasWon;
```

**Examples:**
```javascript
false |= false  →  false  // Nobody won yet
false |= true   →  true   // Someone won!
true  |= false  →  true   // Keep true
```

---

#### **Step 5: Move winner to win queue**
```javascript
if (hasWon) {
    this.#activeQueue.remove(playerId);
    this.#winQueue.push(playerId);
}
```

**Example:**
```javascript
// Before:
activeQueue = [1, 2, 3]
winQueue = []

// Player 2 wins:
activeQueue.remove(2)  →  activeQueue = [1, 3]
winQueue.push(2)       →  winQueue = [2]

// Now only Player 1 and 3 are still playing
```

---

#### **Step 6: Move to next turn (if nobody won)**
```javascript
if (!anyWins) {
    this.#activeQueue.next();
}
```

**Why this check?**
- If someone won, we might need to show celebration screen
- Don't immediately move to next player
- Let the UI handle the win first

**What `next()` does:**
```javascript
// Before: current = 1
activeQueue.next()
// After: current = 2
```

---

### updateQueues() Example:

```javascript
// Scenario: Player 2 reaches square 99

// Active players: [1, 2, 3]
// Winner: None yet

forEach player:
  Player 1: position = (5, 4) → Not at goal → Continue
  Player 2: position = (9, 9) → AT GOAL! → hasWon = true
  Player 3: position = (7, 8) → Not at goal → Continue

anyWins = true (Player 2 won)

Player 2 won:
  - Remove 2 from activeQueue → [1, 3]
  - Add 2 to winQueue → [2]

anyWins is true, so DON'T call next()
(Let UI show "Player 2 wins!")
```

---

## 🎯 PART 5: Helper Methods

### advancePlayer()
```javascript
advancePlayer(playerId, result) {
    let player = this.#players.get(playerId);
    return this.#grid.advance(player, result);
}
```

**Purpose:** Bridge between Game and Grid  
**Translation:** "Get this player's data and tell the grid to move them."

---

### processEffects()
```javascript
processEffects(playerId, effects) {
    let player = this.#players.get(playerId);
    if (effects instanceof Tile) {
        effects.effect(this, player);
    }
}
```

**Purpose:** Trigger snake/ladder effects  
**Translation:** "If they landed on a special tile, activate it."

---

### checkWinCondition()
```javascript
checkWinCondition(player) {
    return player.position.key() === this.#grid.goal.key();
}
```

**Purpose:** Check if player reached the goal  
**Example:**
```javascript
player.position = (9, 9)  → key() = "9,9"
grid.goal = (9, 9)        → key() = "9,9"
"9,9" === "9,9"           → true (WINNER!)
```

---

### playCard()
```javascript
playCard(playerId, cardId, params) {
    let player = this.#players.get(playerId);
    let card = player.cards[cardId];
    player.cards.splice(cardId, 1);
    card.effect(this, player, params);
}
```

**Purpose:** Use special power-up cards  
**Steps:**
1. Get player's data
2. Get the specific card from their hand
3. Remove card from hand (splice)
4. Activate card's effect

**Example:**
```javascript
// Player 1 has cards: ["Skip Turn", "Extra Roll", "Teleport"]
playCard(1, 1, null);  // Use card at index 1 ("Extra Roll")

// After:
// Player 1's cards: ["Skip Turn", "Teleport"]  (card removed)
// Extra roll effect activates
```

---

## 📊 PART 6: Getters (Read-Only Access)

### get current()
```javascript
get current() {
    return this.#activeQueue.current;
}
```
**Returns:** The player ID whose turn it is  
**Example:** `game.current → 2` (Player 2's turn)

---

### get players()
```javascript
get players() {
    return this.#players;
}
```
**Returns:** The entire Map of player data  
**Example:** `game.players.get(1)` → Player 1's data

---

### get winQueue()
```javascript
get winQueue() {
    return this.#winQueue.slice();
}
```
**Returns:** Copy of winner list  
**Why `.slice()`?** Prevents external code from modifying the original array

**Example:**
```javascript
let winners = game.winQueue;  // [2, 1]
winners.push(3);  // Doesn't affect the real winQueue
```

---

### get activeQueue()
```javascript
get activeQueue() {
    return this.#activeQueue.data.slice();
}
```
**Returns:** Copy of active players  
**Example:** `[1, 3]` (Players still playing)

---

## 🎮 COMPLETE GAME FLOW EXAMPLE

```javascript
// Setup
let game = new Game([1, 2, 3], grid);

// Turn 1: Player 1
game.playTurn();
  → Rolls 4
  → Moves from (0,0) to (4,0)
  → No snake/ladder
  → Doesn't win
  → Switch to Player 2

// Turn 2: Player 2
game.playTurn();
  → Rolls 6
  → Moves from (0,0) to (6,0)
  → Lands on ladder! → Moves to (6,2)
  → Doesn't win
  → Switch to Player 3

// ... Many turns later ...

// Turn 47: Player 2 (at square 95)
game.playTurn();
  → Rolls 4
  → Moves from (5,9) to (9,9) ← SQUARE 99!
  → No tile effect
  → WINS!
  → activeQueue = [1, 3]
  → winQueue = [2]
  → DON'T switch turn (show win screen)
```

---

## 🧠 Memory Aid: The Game Class in One Picture

```
┌────────────────────────────────────────┐
│           GAME CLASS                   │
├────────────────────────────────────────┤
│ 📝 DATA STORAGE:                       │
│  • players (who's playing)             │
│  • grid (the board)                    │
│  • activeQueue (turn order)            │
│  • winQueue (who finished)             │
├────────────────────────────────────────┤
│ 🎮 MAIN ACTION:                        │
│  playTurn() ← THE CORE!                │
│    1. Roll dice                        │
│    2. Move player                      │
│    3. Handle snake/ladder              │
│    4. Check winner & switch turns      │
├────────────────────────────────────────┤
│ 🔧 HELPERS:                            │
│  • advancePlayer() - moves piece       │
│  • processEffects() - snakes/ladders   │
│  • updateQueues() - winners & turns    │
│  • checkWinCondition() - reached 99?   │
│  • playCard() - use power-ups          │
├────────────────────────────────────────┤
│ 👀 GETTERS:                            │
│  • current - whose turn?               │
│  • players - all player data           │
│  • winQueue - who won?                 │
│  • activeQueue - who's still playing?  │
└────────────────────────────────────────┘
```

---

