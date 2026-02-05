# Snake & Ladders Web Project - Emergency Interview Prep
## Part 4: Beginner Architecture Q&A (100 Questions)

---

## SECTION 1: PROJECT OVERVIEW & STRUCTURE (Questions 1-15)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 1 | What is your project about? | "A browser-based Snake & Ladders game with challenge modes." | Like the board game but on computer, with extra features like shuffle and elimination. | Players roll dice, move pieces, snakes send you down, ladders up |
| 2 | How many files in your project? | "About 23 files: HTML, CSS, and JavaScript modules." | Organized like a filing cabinet - separate folders for different types. | `html/`, `css/`, `js/` folders with game logic files |
| 3 | What technologies did you use? | "Vanilla JavaScript, HTML5, CSS3 - no frameworks." | Built from scratch without helper libraries like React or Bootstrap. | Pure JS, no jQuery, no React, no Vue |
| 4 | Why no frameworks? | "Wanted to learn core JavaScript concepts deeply." | Like learning to drive stick shift before automatic - understand fundamentals. | Frameworks hide how things work; vanilla shows you |
| 5 | What's the main entry point? | "`welcome.html` - the first page users see." | Front door of the application - where users start. | Click "Play" → goes to `home.html` for setup |
| 6 | How is your code organized? | "Separate files for game logic, UI, and data." | Like kitchen, dining room, pantry - each has its purpose. | `game.js` = rules, `game-board.js` = display, `cards.js` = items |
| 7 | What does `game.js` do? | "Contains the main Game class with all game rules." | The rulebook - knows how to move players, check wins, handle cards. | `class Game { constructor() {...} advancePlayer() {...} }` |
| 8 | What does `game-board.js` do? | "Handles the visual display and user interactions." | The TV screen - shows the game and responds to clicks. | Updates dice images, moves player markers, plays sounds |
| 9 | What's the difference between HTML and CSS? | "HTML is structure; CSS is styling." | HTML = skeleton, CSS = skin and clothes. | `<div>` in HTML, `div { color: red; }` in CSS |
| 10 | What's JavaScript's role? | "Adds interactivity and game logic." | The brain and muscles - makes things happen when clicked. | `button.addEventListener('click', rollDice)` |
| 11 | How do files connect to each other? | "HTML includes CSS with `<link>` and JS with `<script>`." | Like plugging in appliances - connect them to work together. | `<link rel="stylesheet" href="style.css">` `<script src="game.js"></script>` |
| 12 | What is `index.html`? | "The default page that loads when visiting the site." | The homepage - what shows up first. | Usually `welcome.html` or redirect to it |
| 13 | Why multiple HTML files? | "Each page has a different purpose - welcome, setup, game, leaderboard." | Different rooms for different activities. | `welcome.html` → `home.html` → `game-board.html` → `leaderboard.html` |
| 14 | What's in your assets folder? | "Images, sounds, and fonts used by the game." | Props for the play - dice pictures, player icons, sound effects. | `dice-1.png`, `Player1-Icon.jpg`, `diceRoll.wav` |
| 15 | How do you test your game? | "Play it in browser, use console for debugging." | Try it out, check if it works, fix what's broken. | `console.log()` to see values, DevTools to inspect |

---

## SECTION 2: HTML FUNDAMENTALS (Questions 16-30)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 16 | What does HTML stand for? | "HyperText Markup Language." | The language that creates the structure of web pages. | `<html>`, `<body>`, `<div>` tags |
| 17 | What is a tag in HTML? | "Keywords surrounded by angle brackets that define elements." | Like labels that tell browser what something is. | `<p>` = paragraph, `<button>` = button |
| 18 | What's the difference between `<div>` and `<span>`? | "`<div>` is block (takes full width); `<span>` is inline (stays in line)." | `<div>` = new line. `<span>` = same line. | `<div>Block</div>` vs `<span>Inline</span>` |
| 19 | What is an attribute? | "Extra information added to HTML tags." | Like adding details to a label - ID, class, style. | `<div id="board" class="game">` |
| 20 | What is `id` vs `class`? | "`id` is unique (one per page); `class` can be reused." | `id` = your name (only you). `class` = your team (many people). | `<div id="player1">` vs `<div class="player">` |
| 21 | What is the `<head>` section? | "Contains metadata - title, styles, scripts to load." | Behind-the-scenes info - not visible but important. | `<head><title>My Game</title><link rel="stylesheet" href="style.css"></head>` |
| 22 | What is the `<body>` section? | "Contains visible content of the page." | What users actually see and interact with. | `<body><h1>Welcome</h1><button>Play</button></body>` |
| 23 | What is a `<button>` element? | "Creates a clickable button." | Something users can press to do something. | `<button onclick="startGame()">Start</button>` |
| 24 | What is an `<img>` tag? | "Displays an image on the page." | Shows pictures - dice, player icons, board. | `<img src="dice-1.png" alt="Dice showing 1">` |
| 25 | What is the `src` attribute? | "Specifies the source/location of a file." | Tells browser where to find the image or script. | `<img src="images/dice.png">` |
| 26 | What is the `alt` attribute? | "Text shown if image can't load; also for screen readers." | Backup description for when picture fails or for blind users. | `<img src="dice.png" alt="Dice showing number 3">` |
| 27 | What is a `<template>` tag? | "Holds HTML that isn't displayed until copied." | Cookie cutter - hidden until you stamp out a copy. | `<template id="playerCard"><div>...</div></template>` |
| 28 | What is a `<dialog>` element? | "Creates a popup box for messages or questions." | Popup window for "Are you sure?" or notifications. | `<dialog><p>Game Over!</p><button>OK</button></dialog>` |
| 29 | What is semantic HTML? | "Using tags that describe their meaning." | Using `<header>` instead of `<div class="header">` - clearer meaning. | `<header>`, `<nav>`, `<main>`, `<footer>` |
| 30 | Why use semantic HTML? | "Better for accessibility and SEO." | Screen readers understand it; search engines rank it better. | `<nav>` tells screen reader "this is navigation" |

---

## SECTION 3: CSS FUNDAMENTALS (Questions 31-50)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 31 | What does CSS stand for? | "Cascading Style Sheets." | The language that makes web pages look pretty. | `body { background: blue; }` |
| 32 | What is a CSS selector? | "Pattern that selects HTML elements to style." | Like pointing at something and saying "change this." | `div`, `.class`, `#id`, `button:hover` |
| 33 | What is a CSS property? | "What you want to change (color, size, position)." | The thing you're adjusting. | `color`, `font-size`, `margin`, `padding` |
| 34 | What is a CSS value? | "The setting for a property." | How much or what kind of change. | `color: red;` → `red` is the value |
| 35 | What is the box model? | "Every element is a box: content, padding, border, margin." | Like a gift: present (content), wrapping (padding), box (border), space around (margin). | `content → padding → border → margin` |
| 36 | What is `padding`? | "Space inside the element, between content and border." | Inner breathing room - inside the box. | `padding: 10px;` |
| 37 | What is `margin`? | "Space outside the element's border." | Outer breathing room - between boxes. | `margin: 20px;` |
| 38 | What is `border`? | "Line around the element's padding." | The edge of the box. | `border: 2px solid black;` |
| 39 | What is `width` and `height`? | "Dimensions of the element's content area." | How big the box is. | `width: 100px; height: 50px;` |
| 40 | What is `display: flex`? | "Makes children flexible and alignable." | Like a row of rubber bands that stretch and line up. | `.container { display: flex; }` |
| 41 | What is `display: grid`? | "Creates a 2D grid layout." | Like graph paper - rows and columns. | `.board { display: grid; grid-template-columns: repeat(10, 1fr); }` |
| 42 | What is `position: relative`? | "Element stays in flow but can be offset." | In line but can lean a bit. | `.marker { position: relative; left: 10px; }` |
| 43 | What is `position: absolute`? | "Element removed from flow, positioned relative to nearest positioned ancestor." | Floating freely, positioned from a reference point. | `.tooltip { position: absolute; top: 0; left: 0; }` |
| 44 | What is `z-index`? | "Controls stacking order (what's on top)." | Layers - higher number = on top. | `z-index: 10;` puts element above `z-index: 5` |
| 45 | What is a media query? | "Applies CSS only when conditions match (like screen width)." | Different rules for different situations. | `@media (max-width: 600px) { .board { width: 100%; } }` |
| 46 | What is `transform: translate()`? | "Moves element without affecting layout." | Slide to a new position smoothly. | `transform: translateX(100px);` |
| 47 | What is `transition`? | "Smoothly animates property changes." | Fade from one state to another instead of jumping. | `transition: background-color 0.3s;` |
| 48 | What is `background-color`? | "Sets the background color of an element." | What color fills the box. | `background-color: #4CAF50;` |
| 49 | What is `color`? | "Sets the text color." | What color the words are. | `color: white;` |
| 50 | What is `font-size`? | "Sets the size of text." | How big or small the letters are. | `font-size: 16px;` or `font-size: 1.5rem;` |

---

## SECTION 4: JAVASCRIPT BASICS (Questions 51-70)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 51 | What is JavaScript? | "Programming language that adds interactivity to web pages." | The brain that makes websites do things. | `alert('Hello!');` |
| 52 | What is a variable? | "Container for storing data values." | Like a labeled box you put things in. | `let score = 0;` |
| 53 | What is `let`? | "Declares a variable that can be changed." | Box with contents you can replace. | `let name = "Alice"; name = "Bob";` |
| 54 | What is `const`? | "Declares a variable that cannot be reassigned." | Box with permanent contents - can't replace, can modify inside. | `const PI = 3.14;` |
| 55 | What is a function? | "Reusable block of code that performs a task." | Recipe you can use multiple times. | `function greet(name) { return "Hello " + name; }` |
| 56 | What is a parameter? | "Variable in function definition that receives input." | Placeholder for the actual value. | `function rollDice(sides)` - `sides` is parameter |
| 57 | What is an argument? | "Actual value passed to a function." | The real thing you put in the placeholder. | `rollDice(6)` - `6` is the argument |
| 58 | What is `return`? | "Sends a value back from a function." | The answer the function gives back. | `function add(a, b) { return a + b; }` |
| 59 | What is an array? | "Ordered list of values." | A row of boxes, each with a number (index). | `let players = ["Alice", "Bob", "Carol"];` |
| 60 | How do you access array items? | "Use index in square brackets (starts at 0)." | Box number 0 is the first one. | `players[0]` → "Alice" |
| 61 | What is an object? | "Collection of key-value pairs." | A box with labeled compartments. | `let player = { name: "Alice", score: 100 };` |
| 62 | How do you access object properties? | "Use dot notation or bracket notation." | Read the label to get the value. | `player.name` or `player["name"]` |
| 63 | What is a method? | "Function that belongs to an object." | Action that an object can do. | `player.move = function() { ... };` |
| 64 | What is a loop? | "Code that repeats until a condition is met." | Doing something over and over. | `for (let i = 0; i < 5; i++) { console.log(i); }` |
| 65 | What is `if` statement? | "Runs code only if condition is true." | Decision maker - do this IF that. | `if (score > 100) { alert("You win!"); }` |
| 66 | What is `else`? | "Runs code if `if` condition is false." | Otherwise do this instead. | `if (won) { celebrate(); } else { tryAgain(); }` |
| 67 | What is `===` vs `==`? | "`===` checks value AND type; `==` only value (with coercion)." | Strict equals vs loose equals. Always use `===`. | `5 === "5"` → false. `5 == "5"` → true |
| 68 | What is `console.log()`? | "Prints output to browser console for debugging." | Like talking to yourself to check what's happening. | `console.log("Player moved to", position);` |
| 69 | What is `typeof`? | "Returns the type of a value." | Asks "what kind of thing is this?" | `typeof "hello"` → "string". `typeof 42` → "number" |
| 70 | What is `parseInt()`? | "Converts string to integer number." | Turn text like "5" into number 5. | `parseInt("10")` → 10 |

---

## SECTION 5: DOM MANIPULATION BASICS (Questions 71-85)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 71 | What is the DOM? | "Document Object Model - tree representation of HTML." | JavaScript's view of the web page structure. | `<html>` → `<body>` → `<div>` tree |
| 72 | What is `document`? | "The root object representing the entire web page." | The starting point for accessing everything on the page. | `document.getElementById("board")` |
| 73 | What is `getElementById()`? | "Finds element by its unique ID." | Look up something by its name tag. | `const board = document.getElementById("gameBoard");` |
| 74 | What is `querySelector()`? | "Finds first element matching a CSS selector." | Search for something using CSS-style description. | `const btn = document.querySelector(".roll-button");` |
| 75 | What is `querySelectorAll()`? | "Finds all elements matching a CSS selector." | Find everything that matches. | `const markers = document.querySelectorAll(".player-marker");` |
| 76 | What is `addEventListener()`? | "Attaches a function to run when an event happens." | "When this happens, do that." | `btn.addEventListener("click", rollDice);` |
| 77 | What is a click event? | "Fires when user clicks an element." | User pressed the mouse button on something. | `button.addEventListener("click", () => alert("Clicked!"));` |
| 78 | What is `textContent`? | "Gets or sets the text inside an element." | The words inside a tag. | `element.textContent = "Player 1";` |
| 79 | What is `innerHTML`? | "Gets or sets HTML content inside an element." | The HTML code inside a tag. | `element.innerHTML = "<b>Bold</b>";` |
| 80 | What is `style` property? | "Accesses inline CSS styles of an element." | Change how something looks directly. | `element.style.color = "red";` |
| 81 | What is `classList`? | "Object to add, remove, or toggle CSS classes." | Manage the classes on an element. | `element.classList.add("active");` |
| 82 | What is `createElement()`? | "Creates a new HTML element." | Make a new piece of HTML from scratch. | `const div = document.createElement("div");` |
| 83 | What is `appendChild()`? | "Adds a child element to a parent." | Put something inside something else. | `parent.appendChild(child);` |
| 84 | What is `removeChild()`? | "Removes a child element from a parent." | Take something out of its container. | `parent.removeChild(child);` |
| 85 | What is `setAttribute()`? | "Sets an attribute value on an element." | Add or change an attribute like ID or class. | `element.setAttribute("id", "player1");` |

---

## SECTION 6: LOCALSTORAGE BASICS (Questions 86-100)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 86 | What is LocalStorage? | "Browser storage that persists data between sessions." | A backpack that remembers what's inside even after you leave. | `localStorage.setItem("name", "Alice");` |
| 87 | How much can LocalStorage hold? | "About 5-10 megabytes per website." | Small jar - holds a decent amount but not unlimited. | Enough for game saves, not for videos |
| 88 | How do you save data? | "Use `setItem(key, value)`." | Put something in the backpack with a label. | `localStorage.setItem("playerName", "Alice");` |
| 89 | How do you read data? | "Use `getItem(key)`." | Look in the backpack for something by its label. | `const name = localStorage.getItem("playerName");` |
| 90 | How do you delete data? | "Use `removeItem(key)` or `clear()`." | Take one thing out or empty the whole backpack. | `localStorage.removeItem("playerName");` or `localStorage.clear();` |
| 91 | What is a key in LocalStorage? | "String identifier for stored data." | The label on your stored item. | `"gameState"`, `"playerName"`, `"highScore"` |
| 92 | What is a value in LocalStorage? | "The actual data being stored." | What's inside the labeled box. | Any string: `"Alice"`, `'{"score":100}'` |
| 93 | Why use JSON with LocalStorage? | "LocalStorage only stores strings; JSON converts objects." | Objects need to become text to store, then back to objects. | `localStorage.setItem("game", JSON.stringify(gameData));` |
| 94 | What is `JSON.stringify()`? | "Converts JavaScript object to JSON string." | Pack an object into a text format. | `JSON.stringify({name:"Alice"})` → `'{"name":"Alice"}'` |
| 95 | What is `JSON.parse()`? | "Converts JSON string back to JavaScript object." | Unpack text back into a usable object. | `JSON.parse('{"name":"Alice"}')` → `{name:"Alice"}` |
| 96 | When does LocalStorage data expire? | "Never - persists until manually cleared." | Like a tattoo - stays forever unless you remove it. | Survives browser restarts, computer shutdowns |
| 97 | Is LocalStorage secure? | "Not really - users can see and modify it." | Like a diary with no lock - anyone can read and change. | Don't store passwords or sensitive data |
| 98 | Can multiple tabs share LocalStorage? | "Yes - same website tabs share the same storage." | Shared whiteboard - all tabs see the same thing. | Tab A saves, Tab B reads → gets A's data |
| 99 | What happens in private/incognito mode? | "LocalStorage may be limited or cleared when closed." | Some browsers don't allow it in private mode. | Code should work without persistence as fallback |
| 100 | Why save game state? | "So players can resume if they close the browser." | Like a save point in video games - come back later. | Save after each turn, load when returning |

---

## Quick Reference: Beginner Interview Checklist

### Before the Interview:
- [ ] Can explain what the project does in 30 seconds
- [ ] Know the file structure (HTML/CSS/JS separation)
- [ ] Can draw the game flow on a whiteboard
- [ ] Understand basic HTML tags and their purposes
- [ ] Know CSS selectors and basic properties
- [ ] Understand variables, functions, and objects in JS
- [ ] Can explain how DOM manipulation works
- [ ] Know what LocalStorage is and how to use it

### During the Interview:
- [ ] Speak clearly and confidently
- [ ] Use the ELI5 analogies provided
- [ ] Reference your actual code when possible
- [ ] Admit if you don't know something
- [ ] Show enthusiasm for learning

---

**Next: Part 5 - Beginner JavaScript Core Concepts (100 Questions)**
