export const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export const CPU_LEVELS = ['Beginner', 'Casual', 'Sharp', 'Tricky', 'Unbeatable'];

export function otherPlayer(player) {
    return player === 'X' ? 'O' : 'X';
}

// Returns { player, line } for a completed line, or null
export function findWinner(board) {
    for (const line of LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { player: board[a], line };
        }
    }
    return null;
}

function emptySquares(board) {
    return board.flatMap((value, i) => (value ? [] : [i]));
}

function pick(options, random) {
    return options[Math.floor(random() * options.length)];
}

// A square that completes a line for player, if there is one
function winningMove(board, player) {
    return emptySquares(board).find((i) => {
        const next = board.slice();
        next[i] = player;
        return findWinner(next)?.player === player;
    });
}

// Positions already scored; the same position always scores the same
const minimaxCache = new Map();

// Positive when good for cpu; quicker wins and slower losses score higher.
// Depth is the number of filled squares, so it's part of the position itself.
function minimax(board, cpu, toMove) {
    const key = board.map((v) => v ?? '-').join('') + cpu + toMove;
    if (minimaxCache.has(key)) return minimaxCache.get(key);

    const depth = board.filter(Boolean).length;
    const winner = findWinner(board);
    let score;
    if (winner) {
        score = winner.player === cpu ? 10 - depth : depth - 10;
    } else if (depth === 9) {
        score = 0;
    } else {
        const scores = emptySquares(board).map((i) => {
            const next = board.slice();
            next[i] = toMove;
            return minimax(next, cpu, otherPlayer(toMove));
        });
        score = toMove === cpu ? Math.max(...scores) : Math.min(...scores);
    }
    minimaxCache.set(key, score);
    return score;
}

function bestMove(board, cpu, random) {
    const scored = emptySquares(board).map((i) => {
        const next = board.slice();
        next[i] = cpu;
        return { i, score: minimax(next, cpu, otherPlayer(cpu)) };
    });
    const top = Math.max(...scored.map((s) => s.score));
    // Choose randomly among equally good moves so games don't repeat
    return pick(scored.filter((s) => s.score === top).map((s) => s.i), random);
}

// Win if possible, otherwise (sometimes) block, otherwise fall back
function tacticalMove(board, cpu, random, { blockChance, fallback }) {
    const win = winningMove(board, cpu);
    if (win !== undefined) return win;
    const block = winningMove(board, otherPlayer(cpu));
    if (block !== undefined && random() < blockChance) return block;
    return fallback();
}

// level runs from 1 (Beginner) to 5 (Unbeatable); each level adds a skill
export function chooseCpuMove(board, cpu, level, random = Math.random) {
    const randomMove = () => pick(emptySquares(board), random);
    switch (level) {
        case 1: // plays anywhere
            return randomMove();
        case 2: // takes wins, blocks half the time
            return tacticalMove(board, cpu, random, { blockChance: 0.5, fallback: randomMove });
        case 3: // always wins and blocks, but can be caught by a fork
            return tacticalMove(board, cpu, random, { blockChance: 1, fallback: randomMove });
        case 4: // perfect about half the time
            return random() < 0.5
                ? bestMove(board, cpu, random)
                : tacticalMove(board, cpu, random, { blockChance: 1, fallback: randomMove });
        default:
            return bestMove(board, cpu, random);
    }
}
