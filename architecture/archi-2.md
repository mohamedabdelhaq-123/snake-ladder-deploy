# Snake & Ladders Web Project - Emergency Interview Prep
## Part 2: Architecture & Project Decisions Q&A (150 Questions)

---

## SECTION 1: LOCALSTORAGE VS DATABASE (Questions 1-20)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 1 | Why LocalStorage over a database? | "Instant data access without server setup, perfect for offline gameplay." | LocalStorage = backpack (always with you). Database = locker (need key, wait in line). | `localStorage.setItem("gameState", JSON.stringify(state))` |
| 2 | What if user clears browser data? | "All progress lost - trade-off for simplicity." | Like pencil on whiteboard - anyone can erase. | `localStorage.clear()` wipes everything |
| 3 | LocalStorage size limit? | "5-10MB per origin; throws QuotaExceededError when full." | Small jar - when full, can't add more. | `try { localStorage.setItem(k,v) } catch(e) { if(e.name==='QuotaExceededError')... }` |
| 4 | Why not IndexedDB? | "LocalStorage's sync API is simpler for small game state." | Filing cabinet vs sticky note - latter is faster for small data. | Game state is <1MB (positions, cards, queue) |
| 5 | Is LocalStorage secure? | "No - users can modify data via DevTools." | Diary with no lock - anyone can edit. | Edit values in DevTools → instant win cheat |
| 6 | One JSON blob vs multiple keys? | "Single atomic operation reduces corruption risk." | One suitcase vs 10 bags - all arrive together or nothing. | `game.toJson()` → one `setItem("gameState", json)` |
| 7 | Handle private mode limitations? | "Gracefully fall back to memory-only." | Whiteboard in a no-marker room - work without persistence. | `loadGameState()` returns `false` → start fresh |
| 8 | LocalStorage vs SessionStorage? | "LocalStorage persists forever; SessionStorage dies with tab." | Tattoo vs sticky note - former stays forever. | `sessionStorage` = lose on close. `localStorage` = keep forever |
| 9 | Why JSON.stringify? | "LocalStorage only stores strings; objects must serialize." | Text-only box - need photo of toy (JSON) to store. | `JSON.stringify({x:5})` → `'{"x":5}'` → parse back |
| 10 | Migrate save data on structure change? | "Version your save data; write migration functions." | Renovating house - plan for each room, upgrade old saves. | Add `"version":2` → `if(data.version===1) migrateV1ToV2(data)` |
| 11 | Multiple tabs access same LocalStorage? | "Yes - shared across tabs from same origin." | Shared whiteboard - everyone sees changes. | Tab A saves, Tab B loads → gets A's data |
| 12 | Why not cookies for game state? | "Cookies sent with every HTTP request - overhead." | Name tag everyone reads vs pocket note only you see. | Every request carries 4KB cookie - bandwidth waste |
| 13 | Prevent save corruption during writes? | "Trade-off - no atomic writes implemented." | Writing while power might cut - letter may be half-written. | Write to temp key → remove old → rename (for critical apps) |
| 14 | Performance impact of frequent writes? | "Sync writes can block UI; save only at turn end." | Librarian stops everything to file - do it once per turn. | `saveGameState()` after `activePlayerLeaderboardHighlight()` |
| 15 | Implement cloud saves? | "Add sync layer uploading LocalStorage to server." | Photocopy diary, mail to safe - download on login. | `syncToCloud(): read LS → POST /api/save → server stores` |
| 16 | Store icons as numbers not URLs? | "Numbers smaller; map to URLs consistently." | "Player 3" vs "person in red shirt with stripes" | Store `imgNumber:2` → `src="Player${imgNumber}-Icon.jpg"` |
| 17 | Player queue data structure? | "CyclicQueue class for O(1) turn switching." | Circular table - move pointer, don't reshuffle chairs. | `[1,2,3,4]` with index. Next: `(index+1)%4` |
| 18 | Win queue ordering? | "Push to winQueue in finish order." | Finish line photo - first = #1, second = #2. | `winQueue.push(playerId)` when `checkWinCondition()` true |
| 19 | Separate PlayerGameData from PlayerAccountData? | "Separation of concerns: game state vs profile." | Driver's license (profile) vs current location (game state). | `PlayerAccountData`: name, icon. `PlayerGameData`: position, cards |
| 20 | Multiplayer online version? | "Server-authoritative model with WebSockets." | Need referee everyone trusts, not each player being boss. | Server holds true state, broadcasts updates |

---

## SECTION 2: CSS & RESPONSIVE DESIGN (Questions 21-40)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 21 | Vanilla CSS vs Bootstrap? | "Full control without framework bloat." | Cooking from scratch vs meal kit - only what you need. | Custom animations, board layout - Bootstrap would fight |
| 22 | Responsive without framework? | "CSS Grid, Flexbox, custom media queries." | Rubber bands (Flexbox) + chessboard (Grid) + asking screen size. | `@media(max-width:768px){.board{transform:scale(0.5)}}` |
| 23 | Mobile strategy for board? | "Scale proportionally, stack UI vertically." | Transformer - same parts, different arrangement. | Desktop: side-by-side. Mobile: stacked |
| 24 | CSS Grid for board? | "Precise 2D control for 10x10 tiles." | Graph paper vs line of people - former for 2D. | `grid-template-columns: repeat(10, 1fr)` |
| 25 | Center markers on tiles? | "Offset = (tile - marker) / 2." | Center photo in frame - measure space, divide by 2. | `MARKER_OFFSET = (CELL_SIZE - MARKER_SIZE) / 2` |
| 26 | CSS transforms vs top/left? | "GPU acceleration for 60fps animations." | Physical furniture move vs hologram - GPU handles latter. | `transform: translateX(100px)` vs `left: 100px` |
| 27 | Zigzag board pattern? | "Flip x for odd rows using modulo." | Book where odd pages go right-to-left. | `if(pos.y%2!==0){xIndex=(GRID_W-pos.x-1)}` |
| 28 | CSS file organization? | "global.css for shared, page-specific for unique." | School uniform vs club t-shirts. | `global.css`: nav, footer. `game-board.css`: board, dice |
| 29 | CSS custom properties? | "Ideal for theming - reusable values." | Nicknames for colors - change once, updates everywhere. | `:root{--primary:#4CAF50;--cell:80px}` |
| 30 | Cross-browser consistency? | "Test in Chrome, Firefox, Safari." | Different car brands - mostly same, test drive each. | Grid/Flexbox: 97%+ coverage, no prefixes needed |
| 31 | `position:relative` for markers? | "Keeps in document flow while allowing offsets." | Standing in line but leaning - still in your spot. | `.marker{position:relative;transform:translate(x,y)}` |
| 32 | High-DPI (Retina) displays? | "SVG or 2x resolution images." | Microscope shows pixelation - use sharper images. | `dice.svg` scales perfectly. `dice@2x.png` for retina |
| 33 | CSS specificity conflicts? | "BEM naming convention avoids wars." | Unique names = no shouting to be heard. | `.game-board__marker--dangerous` vs generic `.dangerous` |
| 34 | Inline styles vs external CSS? | "Dynamic values (positions) calculated in JS." | Painted wall (CSS) vs digital billboard (JS inline). | `marker.style.transform=`translateX(${calcX}px)`` |
| 35 | Animate dice roll? | "Swap src: static → GIF → result PNG." | Flipbook - animation frames, then freeze on final. | `diceImage.src="anim.gif"` → wait → `diceImage.src="dice-4.png"` |
| 36 | `hidden` vs `display:none`? | "`hidden` is semantic HTML." | Says "not relevant now" to browsers/screen readers. | `<div hidden="true">` vs `<div style="display:none">` |
| 37 | Tooltip positioning? | "Absolute relative to container, z-index layering." | Speech bubble floats above - `position:absolute`, `z-index` on top. | `.tooltip{position:absolute;bottom:100%;z-index:10}` |
| 38 | `dangerous` class purpose? | "Visual indicator for No Overlap mode." | Warning label - red border, animation shows active mode. | `.dangerous{border:2px solid red;animation:pulse 1s infinite}` |
| 39 | Footer at bottom? | "Flexbox column with `min-height:100vh`." | Spring-loaded drawer - content pushes down, footer stays. | `body{display:flex;flex-direction:column;min-height:100vh}` |
| 40 | CSS transitions for hover? | "Smooth state changes without JS." | Dimmer switch vs regular - smoother transition. | `button{transition:background-color 0.3s}` |

---

## SECTION 3: DOM MANAGEMENT (Questions 41-60)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 41 | Cache DOM references in arrays? | "Avoids expensive queries on every update." | Keys by door vs searching house every time - 1000x faster. | `uiPlayerMarkers.push(marker)` once, reuse |
| 42 | Dynamic player elements? | "Clone HTML templates, store references." | Cookie cutters - stamp shapes, customize, store for later. | `<template>` → `cloneNode(true)` → customize → store ref |
| 43 | `querySelector` vs `getElementById`? | "`getElementById` is O(1), `querySelector` scans." | Calling by name vs "person in red" - former is instant. | `getElementById("btn")` faster than `querySelector("#btn")` |
| 44 | `DocumentFragment` vs `innerHTML`? | "Fragments batch changes, one reflow." | Prepare off-site, move in at once vs redecorating one by one. | `fragment=template.content.cloneNode(true)` → `container.append(fragment)` |
| 45 | Update positions without re-render? | "Modify transform on cached elements." | Move chess piece vs new board - just update what moved. | `uiPlayerMarkers[id].style.transform=`translateX(${x}px)`` |
| 46 | Individual listeners vs delegation? | "Cards have unique actions; delegation adds complexity." | 3 cards = direct lines simpler than receptionist routing. | `card.addEventListener("click",()=>playCard(index))` |
| 47 | Prevent memory leaks? | "Elements removed with listeners on game end." | Leaving faucets running floods house - remove properly. | `location.reload()` clears all. SPAs: `removeEventListener` |
| 48 | `DOMContentLoaded` vs `window.onload`? | "`DOMContentLoaded` fires before images load - faster." | Start class when students arrive, not when late bus gets there. | `document.addEventListener("DOMContentLoaded",initGame)` |
| 49 | Keyboard accessibility? | "Global listener triggers roll on Space/Enter." | Not everyone uses mouse - keyboard users need to play. | `window.addEventListener("keypress",e=>{if(e.code==="Space")roll()})` |
| 50 | `event.preventDefault()` for keys? | "Prevents page scrolling on Space press." | Space scrolls by default - prevent it, roll dice instead. | `if(e.code==="Space"){e.preventDefault();rollDice()}` |
| 51 | Update leaderboard order? | "Re-append elements in new sequence." | Reshuffle line - physically move to new positions. | `activeQueue.forEach(id=>container.append(uiContainers[id]))` |
| 52 | `firstElementChild` purpose? | "Gets actual content, skips text nodes." | Skip whitespace, grab real HTML element. | `clonedTemplate.firstElementChild` gets div, not whitespace |
| 53 | `classList` vs `className`? | "`classList` preserves existing classes." | Add stickers vs rewrite name tag - former keeps base. | `el.classList.add("active")` keeps others. `className=` wipes |
| 54 | Toggle button states? | "Toggle CSS class, change text content." | One button, two personalities - transformer style. | `btn.classList.toggle("end-turn")` → CSS + text changes |
| 55 | `disabled` during animation? | "Prevents double-clicks, race conditions." | Crosswalk button - press once, wait for walk signal. | `btn.disabled=true` → animate → `btn.disabled=false` |
| 56 | Native `<dialog>` element? | "Browser handles focus, backdrop, accessibility." | Built-in popup - no library needed, works everywhere. | `<dialog>` → `showModal()` → click → `close()` → Promise |
| 57 | Dialog returns Promise? | "Enables async/await for 'pause until decide'." | Wait for user like waiting for delivery - clean code. | `const should=await createDialog("Restart?","confirm")` |
| 58 | Image loading for icons? | "Set src after cloning; browser loads async." | Mail delivery - set address, browser fetches. | `clonedIcon.src="Player${num}-Icon.jpg"` |
| 59 | `NodeList` vs `HTMLCollection`? | "`NodeList` static snapshot; `HTMLCollection` live." | Photo vs live camera feed - latter updates automatically. | `querySelectorAll`=static. `getElementsByClassName`=live |
| 60 | `textContent` vs `innerHTML` for names? | "`textContent` prevents XSS." | `innerHTML` executes scripts! `textContent` is plain text safe. | `el.textContent=userInput` safe. `el.innerHTML=userInput` DANGER |

---

## SECTION 4: STATE MANAGEMENT (Questions 61-85)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 61 | Separate Game logic from UI? | "Separation of concerns - rules shouldn't know DOM." | Kitchen cooks, dining room serves - neither knows other's job. | `Game` class: no `document.getElementById`. UI: no dice math |
| 62 | Sync game state with UI? | "UI reads from Game after changes; one-way flow." | Mirror reflects state - game changes, UI updates to match. | `game.advancePlayer()` → `updateMarkerPosition()` reads → updates DOM |
| 63 | Private class fields (`#players`)? | "Encapsulation prevents external corruption." | Safe vs jar on counter - only owner has combination. | `class Game{ #players=new Map(); get players(){return this.#players} }` |
| 64 | `Point` class purpose? | "Immutable 2D coordinates with helper methods." | GPS coordinates together - immutable, `key()` for comparison. | `new Point(3,4).key()` returns `"3,4"` for Map keys |
| 65 | `Map` vs array for players? | "Map O(1) lookup vs array O(n) search." | Name tag vs scanning crowd - former is instant. | `players.get(id)` instant. `players.find(p=>p.id===id)` slow |
| 66 | CyclicQueue for turns? | "Array with index; modulo cycles through players." | Circular list - at end, wrap to beginning. No array manipulation. | `next(){this.id=(this.id+1)%this.data.length;return this.data[this.id]}` |
| 67 | Store card names not objects? | "Names serialize; full objects have circular refs." | Simple text vs complex object with methods - text saves better. | Save `"Jump 5"` → Load: `nameToCard("Jump 5")` → `new JumpCard(5)` |
| 68 | Elimination row tracking? | "Store row, update to lowest active player each turn." | Flag rises like water - track worst row, eliminate below. | `currentEliminationRow=Math.min(...activeRows)` |
| 69 | Shuffle algorithm biased? | "`sort(()=>Math.random()-0.5)` slightly biased." | Weighted coin - mostly fair, not perfectly. Acceptable for games. | `data.sort(()=>Math.random()-0.5)` - simple, slightly biased |
| 70 | Detect round end for shuffle? | "Index < last_index means wrapped around." | Clock - hour from 12 to 1 = new cycle started. | `if(this.#activeQueue.id<last_index){/*new round*/}` |
| 71 | Prevent moving past 100? | "Clamp distance to max (99 in 0-indexed)." | Fence at field end - can't go past, stay at boundary. | `newDistance=Math.min(newDistance,this.#width*this.#height-1)` |
| 72 | Point vs distance conversion? | "Distance for dice, Point for grid display." | Number line vs map - convert as needed. | `distToPoint`: `x=dist%10`, `y=Math.floor(dist/10)` |
| 73 | PortalTile system? | "Stores start/end Points; `effect()` teleports." | Wormhole - enter start, exit end. Instant position change. | `effect(game,player){player.position=this.#end}` |
| 74 | Tile base class + subclasses? | "Polymorphic effects - same interface, different behavior." | Base defines "what", subclasses define "how". | `tile.effect()` works for PortalTile, CardTile, any future |
| 75 | Card effects polymorphically? | "Base `effect()` interface; subclasses implement." | Remote control - same button, different devices respond. | `card.effect(game,player)` - JumpCard moves, SwapCard swaps |
| 76 | `JSON.stringify` in `toJson()`? | "Flattens object graph to string for LocalStorage." | Pack 3D sculpture to flat box for shipping. | `return JSON.stringify(gameState)` → `'{"players":[...]}'` |
| 77 | Restore methods after `JSON.parse`? | "`fromJson()` reconstructs class instances from data." | Blueprint vs house - build working house with methods. | `PlayerGameData.fromJson(data)` → `new PlayerGameData(id)` → restore |
| 78 | `length=0` vs `[]=[]`? | "Preserves array reference while emptying." | Empty bucket vs throw away - holder keeps same handle. | `this.#queue.data.length=0` same array. `=[]` breaks refs |
| 79 | `this` context in methods? | "Arrow functions preserve lexical `this`." | Arrow remembers "me" from birth. Regular changes by caller. | `setTimeout(()=>this.advance(),1000)` preserves `this` |
| 80 | `forEach` vs `for` loops? | "Declarative cleaner; negligible perf diff for small arrays." | "Do this to each" vs "start, go, step, do" - former cleaner. | `players.forEach(p=>update(p))` vs `for(let i=0;i<...;i++)` |
| 81 | Async in game loop? | "`async/await` for animations; logic stays sync." | Pause without blocking - red light, then green. | `async function update(){await delay(200);updateMarker()}` |
| 82 | `delay` function necessary? | "JS has no `sleep()`; `setTimeout`+Promise enables await." | Single-threaded can't pause everything. Schedule, then await. | `const delay=ms=>new Promise(r=>setTimeout(r,ms))` |
| 83 | Prevent race conditions? | "Disable button during animations; sequential async flow." | Two people talking at once - mute button during processing. | `btn.disabled=true` → animate → `btn.disabled=false` |
| 84 | `game-test.js` purpose? | "Debug file exposing internals via global window." | Production hides, tests need access - globals for debugging. | `window.skip=n=>game.advancePlayer(0,n)` - cheat code |
| 85 | Add undo functionality? | "Store state snapshots in stack; pop to undo." | Game bookmarks - save before move, restore on undo. | `history.push(game.toJson())` → `game.fromJson(history.pop())` |

---

## SECTION 5: CHALLENGE MODES (Questions 86-105)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 86 | Shuffle challenge works how? | "Reorders player queue randomly at round end." | Musical chairs - music stops, everyone scrambles to new spots. | `this.#activeQueue.data.sort(()=>Math.random()-0.5)` |
| 87 | Shuffle at round end vs every turn? | "Round-end predictable; every turn = chaos." | Changing lanes at stoplight vs every second - former manageable. | Check `if(this.#activeQueue.id<last_index)` for new round |
| 88 | `Math.random()-0.5` fair? | "Slightly biased but acceptable for casual play." | Weighted coin - mostly fair, not perfect. Games OK with it. | True Fisher-Yates: swap from end to start |
| 89 | Detect round end? | "Current index < previous means wrapped around." | Lap counter - pass start going forward = lap complete. | `if(this.#activeQueue.id<last_index){/*round complete*/}` |
| 90 | Current player after shuffle? | "UI re-renders; highlight moves with player." | Marked card moves to new spot in deck - stays marked. | `refreshActiveLeaderBoard()` re-appends in new order |
| 91 | No Overlap mode? | "Check same position; send earlier player to start." | Tag - land on someone's square, they go back. | `enforceNoOverlap(player){players.forEach(p=>{if(same)p.position=new Point(0,0)})}` |
| 92 | Send to (0,0) not eliminate? | "Setback keeps player in game." | Starting over = punishment. Elimination = game over. | `other.position=new Point(0,0)` - back to square one |
| 93 | Multiple players same square? | "Iterate all; overlap (not at start) triggers penalty." | Check everyone. Two on square 50 = first there goes back. | `if(player!==other&&same&&!start){sendToStart(other)}` |
| 94 | Exclude start from penalty? | "All start there - penalizing = infinite loop." | Everyone at square 1 - all go back... to square 1. | `position.key()!==new Point(0,0).key()` before penalizing |
| 95 | Elimination mode? | "Rising flag eliminates players below it." | Flood rising - flag = water level, below drowns. | `if(player.position.y<currentEliminationRow){remove(player)}` |
| 96 | Row vs square for elimination? | "Row = vertical progress; simpler than zigzag squares." | Horizontal lines easy to compare. Square numbers zigzag. | `currentEliminationRow=Math.min(...activeRows)` |
| 97 | Flag visual position? | "Pixel offset = row * cell size, CSS transform." | Row 3 = 3*80 = 240px from bottom. Transform moves it. | `flag.style.transform=`translateY(${80*(GRID_H-row-1)}px)`` |
| 98 | One player remains? | "Game ends; remaining player wins." | Last standing wins by default - no need to reach 100. | `if(game.activeQueue.length===1){goToLeaderBoard()}` |
| 99 | Card Tiles separate from challenges? | "Cards give power-ups regardless of challenge mode." | Bonus content, not difficulty setting - always helpful. | `CardTile.effect()` always gives card |
| 100 | Challenges toggle independently? | "Modular design for customized difficulty." | Pizza toppings - mix and match for different experiences. | `challengesToggled=[noOverlap,shuffle,cards,elimination]` |
| 101 | Persist challenge selections? | "Store in LocalStorage, load on home page." | Remember preferences like saved settings. | `localStorage.setItem("challengesToggled",JSON.stringify(toggles))` |
| 102 | Unlock after first win? | "Progressive difficulty - master basics first." | Video game unlockables - earn advanced features. | `if(!challengesUnlocked){challengesDiv.style.display="none"}` |
| 103 | Add new challenge mode? | "Add to array, implement in Game class, add UI toggle." | Plug-and-play: new switch, check in logic, show in UI. | 1. Add to `challengesToggled`. 2. Check in `Game`. 3. Add button |
| 104 | Most complex combination? | "Elimination + No Overlap + Shuffle = chaos." | Flood + no sharing + random turns = maximum chaos mode. | `challengesToggled=[true,true,false,true]` |
| 105 | Balance difficulty? | "Playtesting - adjust parameters based on feedback." | Play, see what's fun, tweak numbers. Science + art. | Elimination too harsh? Raise flag slower. |

---

## SECTION 6: MOBILE RESPONSIVENESS (Questions 106-125)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 106 | Handle different screen sizes? | "Media queries restructure layout; board scales." | Transformer - same parts, different arrangement. | `@media(max-width:768px){.container{flex-direction:column}}` |
| 107 | Viewport units (`vh`,`vw`)? | "Scale with screen size, maintain proportions." | Half table vs 10 inches - former works on any table. | `min-height:100vh` = at least full screen height |
| 108 | Prevent horizontal scroll? | "`max-width:100%`, `overflow-x:hidden`." | Horizontal scroll annoying - keep within screen width. | `body{overflow-x:hidden} img{max-width:100%}` |
| 109 | Touch vs mouse? | "No hover, larger tap targets, no right-click." | Fingers bigger than cursor - design chunky buttons. | Min touch: 44x44px. Your button larger. |
| 110 | Virtual keyboard pushes content? | "`position:fixed` for critical UI; viewport meta tag." | Keyboard takes half screen - fixed elements stay put. | `<meta name="viewport" content="width=device-width,initial-scale=1">` |
| 111 | `transform:scale()` for board? | "Scales proportionally without rewriting calculations." | Photocopier reduce - same layout, smaller size. | `@media(max-width:600px){.board{transform:scale(0.6)}}` |
| 112 | Test mobile without phone? | "DevTools device emulation." | Flight simulator for web dev - resize, simulate touch. | F12 → Toggle Device Toolbar → iPhone/Android preset |
| 113 | Responsive vs adaptive? | "Responsive fluid; adaptive serves different layouts." | Water fills container vs different sized bottles. | Responsive: `width:80%`. Adaptive: `if(width<600)mobile()` |
| 114 | `flex-wrap:wrap` for cards? | "Cards wrap when space runs out." | Text wrapping - hit edge, continue next line. | `display:flex;flex-wrap:wrap` - cards flow like text |
| 115 | High-DPI mobile screens? | "SVG or 2x images for crisp display." | More pixels per inch - sharper images needed. | `icon.svg` or `icon@2x.png` for retina |
| 116 | Large dice roll button? | "Large tap targets easier to hit." | Small = mis-taps = frustration. Apple's 44x44 minimum. | `button{min-height:60px;min-width:150px}` |
| 117 | Prevent double-tap zoom? | "`touch-action:manipulation`." | Double-tap zooms by default - disable for instant response. | `button{touch-action:manipulation}` |
| 118 | Mobile animation performance? | "Use `transform` and `opacity` only." | Some props cause layout recalc - GPU accel for transform. | `transform:translateX(100px)` smooth. `left:100px` janky |
| 119 | Orientation changes? | "Listen for `resize` event; recalculate if needed." | Phone rotates = dimensions flip. Adapt layout. | `window.addEventListener("resize",recalculateLayout)` |
| 120 | `rem` vs `px` for typography? | "`rem` scales with user accessibility preferences." | Users set "larger text" - `rem` respects it. `px` fixed. | `font-size:1.5rem` scales. `font-size:24px` fixed |
| 121 | Mobile "above the fold"? | "Board primary - show first; controls scroll below." | Visible without scrolling - board is star, UI secondary. | Mobile: board top (100% width), controls below |
| 122 | Mobile network loading? | "Minimal initial load; lazy load assets." | Mobile slower - load critical first, rest after. | `<img loading="lazy" src="...">` loads on scroll |
| 123 | Grid `minmax()`? | "Flexible columns within bounds." | Rubber band with limits - flexible but constrained. | `grid-template-columns:repeat(auto-fit,minmax(200px,1fr))` |
| 124 | Safe areas on notched phones? | "`env(safe-area-inset-*)` for notch compensation." | Notches cover content - pad to safe zone. | `padding:env(safe-area-inset-top)...` |
| 125 | Mobile-first vs desktop-first? | "Desktop-first with mobile overrides for this game." | Board games = bigger screens. Override for mobile. | Base desktop styles, `@media(max-width:768px)` for mobile |

---

## SECTION 7: PERFORMANCE (Questions 126-140)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 126 | Minimize DOM manipulation? | "Cache refs, batch updates, use transforms." | Rearranging furniture - plan once, execute efficiently. | Store `uiPlayerMarkers`, update with `transform` |
| 127 | Reading `offsetHeight` repeatedly? | "Forces reflow - expensive." | Asking "where is everything?" - browser must calculate. | Read once, store, reuse. Don't interleave read/write |
| 128 | Optimize dice animation? | "GIF plays automatically - no JS frame animation." | Browser plays GIFs efficiently - don't reinvent. | `diceImage.src="dice-animation.gif"` |
| 129 | Memory impact of DOM refs? | "Minimal - refs small, cheaper than queries." | Phone number vs phone book lookup - tiny vs slow. | 10 refs vs 1000 queries |
| 130 | Prevent layout thrashing? | "Read first, then write, in batches." | Design room then move furniture - don't mix. | Read all layout values, then write all changes |
| 131 | `requestAnimationFrame`? | "Syncs to 60fps refresh rate." | Direct line to screen - "call me before next frame." | `function animate(){update();requestAnimationFrame(animate)}` |
| 132 | Optimize LocalStorage writes? | "Save at turn end, not every micro-change." | Mail letter once, not every word. | `saveGameState()` once per turn |
| 133 | `JSON.stringify` impact? | "O(n) - slower for large objects." | Scans every property. Small = fast. Your state tiny. | `JSON.stringify({players,queue})` - milliseconds |
| 134 | Optimize image loading? | "Right formats (PNG transparency, JPG photos), proper sizing." | Don't load 4000px for 100px display. | Board: JPG. Dice: PNG. Sized appropriately. |
| 135 | CSS sprites? | "Single HTTP request for multiple images." | One package vs many envelopes - less overhead. | `background-image:url(sprites.png);background-position:-50px -100px` |
| 136 | Debounce/throttle events? | "`setTimeout` batches rapid updates." | Don't react to every scroll - wait for pause. | `clearTimeout(timeout);timeout=setTimeout(fn,100)` |
| 137 | Module bundling benefit? | "Fewer HTTP requests, tree-shaking, minification." | Combine files, remove unused, shrink size. | ES6 modules → Webpack → `bundle.js` |
| 138 | Profile performance? | "DevTools Performance tab records runtime." | Doctor's checkup for code - see what's slow. | F12 → Performance → Record → Analyze flame graph |
| 139 | Avoid `console.log` in production? | "Logging has overhead, can leak info." | Talking while working slows you down. | Dev: `console.log`. Prod: remove or conditional |
| 140 | Virtual scrolling for large board? | "Only render visible tiles; recycle elements." | 1000x1000 = million tiles. Show visible only. | Render viewport + buffer. On scroll, update content. |

---

## SECTION 8: SECURITY (Questions 141-150)

| # | Question | Simple Answer | ELI5 Explanation | Code Example |
|---|----------|---------------|------------------|--------------|
| 141 | Prevent XSS? | "`textContent` for user input; never `innerHTML`." | `innerHTML` executes scripts! `textContent` = plain text safe. | `el.textContent=name` safe. `el.innerHTML=name` XSS risk |
| 142 | Validate names with regex? | "Letters only - prevents injection." | Bouncer checking dress code - clean input, clean game. | `if(!/^[a-z]+$/i.test(name)){alert("Letters only!")}` |
| 143 | Protect against LS tampering? | "Can't - client storage untrusted for competitive." | Suggestion box - anyone can write anything. | Acceptable for casual/single-player |
| 144 | `type="module"` for scripts? | "Scope isolation, strict mode, clear dependencies." | Separate rooms - variables don't leak between files. | `<script type="module" src="game.js">` |
| 145 | Handle errors gracefully? | "Try-catch for risky ops; fallback behavior." | Errors happen - don't crash, do something reasonable. | `try{localStorage.setItem(k,v)}catch(e){/*fallback*/}` |
| 146 | Validate inputs? | "Prevents garbage data corrupting state." | Check ID at door - verify before letting in. | `if(playerCount<2){alert("Need 2+ players!");return}` |
| 147 | Prevent infinite loops? | "Validate bounds, ensure progress to termination." | Dog chasing tail forever - ensure each step progresses. | `while(current<goal){current+=roll();if(current>99)current=99}` |
| 148 | Risk of `eval()`? | "Executes arbitrary code - massive security hole." | Letting anyone write code that runs as you. | Never use `eval(userInput)`. Use `JSON.parse` |
| 149 | Sanitize LocalStorage data? | "Parse and validate; don't assume correct format." | Data may be corrupted/old - check before trusting. | `const data=JSON.parse(localStorage.getItem(k));if(!data||!data.players)return default` |
| 150 | HTTPS importance? | "Prevents MITM attacks, ensures data integrity." | Postcards vs sealed envelopes - former visible to all. | `https://` = encrypted. `http://` = visible |

---

**Ready for Part 3: JavaScript Core Concepts Q&A?**
