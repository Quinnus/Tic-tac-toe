# Tic-Tac-Toe

Tic-tac-toe in React and Vite. Play a friend on the same screen, or a CPU that gets harder every time you beat it.

## Playing

- **vs CPU:** you're X and the CPU is O. Each time you win, the CPU moves up a level:

  | Level | How it plays |
  |---|---|
  | Beginner | Anywhere at random |
  | Casual | Takes a winning move, blocks you about half the time |
  | Sharp | Always wins or blocks when it can, but can be caught by a fork |
  | Tricky | Plays perfectly about half the time |
  | Unbeatable | Plays perfectly; the best you can do is draw |

- **2 players:** take turns on the same screen.

Players take turns going first each round. The winning line is highlighted, and the score and CPU level are remembered between visits. **Reset scores** clears the score and puts the CPU back to Beginner.

The squares are buttons, so you can also play with Tab and Enter.

## Development

```bash
pnpm install
pnpm dev       # dev server, reachable from other devices on your network
pnpm build     # production build in dist/
pnpm lint
```

## Files

| File | What it does |
|---|---|
| `src/gameLogic.js` | Winning lines, win detection and the CPU's moves for each level |
| `src/App.jsx` | Game state, turns, scores, CPU levelling and layout |
| `src/App.css` | Styles, including the colour palette and dark mode |
| `src/components/Mark.jsx` | The X and O, drawn as animated strokes |
| `src/components/WinLine.jsx` | The line struck through a winning row |
| `src/components/Confetti.jsx`, `makeConfetti.js` | Confetti when you win |
| `src/*.wav` | Click, win and new-round sounds |
| `public/favicon.svg` | Browser tab icon |
