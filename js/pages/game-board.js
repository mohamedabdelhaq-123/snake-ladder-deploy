

let numberOfPlayers = 4; // Total count of participants
let namesOfPlayers = ["Momo", "ZoZ", "Andrew", "Haneen"]; // Display names array
let playersSummedPosition = Array(numberOfPlayers).fill(0); // Tracks current square (0-100) for each player
let result = 0; // Stores the latest dice roll result
let indexCurrentPlayer = 0; // Tracks whose turn it is (0 to numberOfPlayers - 1)

/**
 * DOM ELEMENT SELECTORS
 * Grabbing references to UI containers and interactive elements.
 */
// Containers for dynamic content
let parentOfPlayersLeaderboard = document.querySelector('.playersLeaderboard');
let parentOfplayersGameLog = document.querySelector('.gameLogPlayersList');

// Lists of elements that update during the game
let playersLeaderboard = document.querySelectorAll('.currentPlayerSquareNumber');
let playersGameLog = document.querySelectorAll('.gameLogPlayers');
let activePlayerLeaderboard = document.getElementsByClassName('playerInfo');
let gameLogList = document.querySelectorAll('.gameLogPlayers');

// Controls and visual indicators
let rollButton = document.getElementById('rollDiceButton');
let diceImage = document.getElementById('diceIcon');
let activeTurnPlayerName = document.getElementById('activeTurnPlayerName');

// Templates used for cloning additional players
let samplePlayerInLeaderBoard = document.querySelector('.sampleClassToBeCloned');
let samplePlayerInGameLog = document.querySelector('.gameLogPlayers');

/**
 * INITIALIZATION: setUpPlayers
 * This function prepares the board by naming existing HTML elements 
 * and cloning new ones if the player count exceeds the initial HTML structure.
 */
function setUpPlayers() {
  // Update the first 2 players who are already hardcoded in the HTML
  for (let i = 0; i < 2; i++) {
    activePlayerLeaderboard[i].querySelector('h5').innerHTML = namesOfPlayers[i];
    gameLogList[i].innerHTML = `${namesOfPlayers[i]} rolled a 0 and moved to Square 0`;
  }

  // Generate additional UI entries for players 3 through N
  for (let i = 2; i < numberOfPlayers; i++) {
    // Clone the leaderboard card (deep clone including children)
    let clonedElement = samplePlayerInLeaderBoard.cloneNode(true);
    clonedElement.querySelector('h5').innerHTML = `${namesOfPlayers[i]}`;
    parentOfPlayersLeaderboard.appendChild(clonedElement);

    // Clone the game log entry
    let clonedLog = samplePlayerInGameLog.cloneNode(true);
    clonedLog.innerHTML = `${namesOfPlayers[i]} rolled a 0 and moved to Square 0`;
    parentOfplayersGameLog.appendChild(clonedLog);
  }

  /**
   * IMPORTANT: We must re-query the DOM after cloning so that the 
   * global arrays include the newly created elements.
   */
  playersLeaderboard = document.querySelectorAll('.currentPlayerSquareNumber');
  playersGameLog = document.querySelectorAll('.gameLogPlayers');
  activePlayerLeaderboard = document.getElementsByClassName('playerInfo');

  // Display the first player's name in the "Current Turn" UI
  activeTurnPlayerName.innerHTML = `${namesOfPlayers[indexCurrentPlayer]}'s Turn`;
}

// Execute setup on script load
setUpPlayers();

/**
 * UI UPDATES: updatePositionsUI
 * Handles the mathematical movement logic and updates the player's status labels.
 */
function updatePositionsUI(indexCurrentPlayer) {
  playersSummedPosition[indexCurrentPlayer] += result;

  // Overflow Logic: If a player rolls past 100, the move is invalidated (stays in place)
  if (playersSummedPosition[indexCurrentPlayer] > 100) {
    playersSummedPosition[indexCurrentPlayer] -= result;
  }

  // Update visual square number and the game log text
  playersLeaderboard[indexCurrentPlayer].innerHTML = `Square ${playersSummedPosition[indexCurrentPlayer]}`;
  playersGameLog[indexCurrentPlayer].innerHTML = `${namesOfPlayers[indexCurrentPlayer]} rolled a ${result} and moved to Square ${playersSummedPosition[indexCurrentPlayer]}`;
}

/**
 * TURN MANAGEMENT: activePlayerLeaderboardHighlight
 * Removes visual focus from current player, increments the turn, and highlights the next player.
 */
function activePlayerLeaderboardHighlight() {
  // Remove the CSS highlight class from the player who just finished
  activePlayerLeaderboard[indexCurrentPlayer].classList.remove('PickedPlayerTurn');

  // Cycle the index (wraps back to 0 when it reaches numberOfPlayers)
  indexCurrentPlayer = (indexCurrentPlayer + 1) % numberOfPlayers;

  // Apply highlight and update the "Current Turn" text for the new player
  activePlayerLeaderboard[indexCurrentPlayer].classList.add('PickedPlayerTurn');
  activeTurnPlayerName.innerHTML = `${namesOfPlayers[indexCurrentPlayer]}'s Turn`;
}

/**
 * EVENT LISTENERS
 * Handling the core game interaction: The Dice Roll.
 */
rollButton.addEventListener('click', () => {
  // Prevent interaction if the current player has already reached the finish line
  if (playersSummedPosition[indexCurrentPlayer] === 100) {
    return; // TODO: Implement game-over or "Skip Winner" logic here
  }

  // Disable button to prevent "double-clicking" while the animation runs
  rollButton.disabled = true;
  diceImage.src = '../assets/images/dice-animation.gif'; 

  // Generate random number between 1 and 6
  result = Math.floor(Math.random() * 6) + 1;

  // Delayed execution to allow the 1-second animation to finish visually
  setTimeout(() => {
    // Show the static image of the rolled number
    diceImage.src = `../assets/images/dice-${result}.png`;

    // Process player movement and shift turns
    updatePositionsUI(indexCurrentPlayer);
    activePlayerLeaderboardHighlight();

    // Re-enable button for the next player's turn
    rollButton.disabled = false;
  }, 1000);
});