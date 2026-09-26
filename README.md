# Bouncing Ball

A simple brick-breaker (Breakout-style) game built with vanilla JavaScript and the HTML5 Canvas API — no libraries or frameworks.

## Play it live
[habibamorgan.github.io/bouncing-ball-game](https://habibamorgan.github.io/bouncing-ball-game/)

## How to play

Open `index.html` in a browser, hit **Play**, then **Start**. Use the **← / →** arrow keys to move the paddle and break all the blocks without letting the ball fall past you. You have 3 lives.

## Project structure

```
BouncingBallGame/
├── index.html          # Page markup
├── css/
│   └── style.css        # Styling for the start screen, buttons, and canvas
├── js/
│   └── script.js         # Game logic (rendering, physics, collisions, state)
├── assets/
│   └── audio/            # Sound effects (block break, win, lose)
└── README.md
```

## Running locally

Because the game loads local audio files via `<audio>`/`fetch`-style paths, some browsers restrict this under the `file://` protocol. If sounds don't play when opening `index.html` directly, serve the folder locally instead, e.g.:

```bash
python3 -m http.server
```

then visit `http://localhost:8000`.

## Credits

Sound effects are third-party assets included under `assets/audio/`; see their original sources for licensing if you plan to redistribute this project.
