import { useEffect, useState } from 'react';
import './App.css';
import clickSound from './click.wav';
import resetSound from './reset.wav';
import winSound from './win.wav';
import { CPU_LEVELS, chooseCpuMove, findWinner, otherPlayer } from './gameLogic.js';
import Confetti from './components/Confetti.jsx';
import { Mark, MarkGradients } from './components/Mark.jsx';
import WinLine from './components/WinLine.jsx';
import { makeConfetti } from './components/makeConfetti.js';

const HUMAN = 'X';
const CPU = 'O';
const EMPTY_BOARD = Array(9).fill(null);
const EMPTY_SCORES = { X: 0, O: 0, draws: 0 };

function playSound(file) {
    // Browsers can refuse to play before the first click; that's fine to ignore
    new Audio(file).play().catch(() => {});
}

function loadValue(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored === null ? fallback : JSON.parse(stored);
    } catch {
        return fallback;
    }
}

function saveValue(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Not saved; the game still works
    }
}

function squareLabel(i, value) {
    return `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, ${value ?? 'empty'}`;
}

function App() {
    const [mode, setMode] = useState(() => loadValue('ttt-mode', 'cpu')); // 'cpu' or 'friend'
    const [board, setBoard] = useState(EMPTY_BOARD);
    const [firstPlayer, setFirstPlayer] = useState(HUMAN);
    const [scores, setScores] = useState(() => {
        const saved = loadValue('ttt-scores', {});
        return {
            cpu: { ...EMPTY_SCORES, ...saved.cpu },
            friend: { ...EMPTY_SCORES, ...saved.friend },
        };
    });
    const [cpuLevel, setCpuLevel] = useState(() => {
        const saved = Number(loadValue('ttt-cpu-level', 1));
        return Math.min(Math.max(Math.round(saved) || 1, 1), CPU_LEVELS.length);
    });
    const [levelledUp, setLevelledUp] = useState(false);
    const [confetti, setConfetti] = useState([]);

    useEffect(() => saveValue('ttt-mode', mode), [mode]);
    useEffect(() => saveValue('ttt-scores', scores), [scores]);
    useEffect(() => saveValue('ttt-cpu-level', cpuLevel), [cpuLevel]);

    // Everything about the current round comes from the board itself
    const winner = findWinner(board);
    const movesMade = board.filter(Boolean).length;
    const isDraw = !winner && movesMade === 9;
    const isOver = Boolean(winner) || isDraw;
    const turn = movesMade % 2 === 0 ? firstPlayer : otherPlayer(firstPlayer);
    const vsCpu = mode === 'cpu';
    const cpuToMove = vsCpu && turn === CPU && !isOver;

    function playMove(index) {
        if (board[index] || isOver) return;
        const next = board.slice();
        next[index] = turn;
        setBoard(next);

        const result = findWinner(next);
        if (result) {
            playSound(winSound);
            // Celebrate a win against the CPU, or any win between friends
            if (!vsCpu || result.player === HUMAN) setConfetti(makeConfetti());
            setScores((all) => ({ ...all, [mode]: { ...all[mode], [result.player]: all[mode][result.player] + 1 } }));
            // Beat the CPU and it gets harder next time
            if (vsCpu && result.player === HUMAN && cpuLevel < CPU_LEVELS.length) {
                setCpuLevel(cpuLevel + 1);
                setLevelledUp(true);
            }
        } else if (next.every(Boolean)) {
            playSound(clickSound);
            setScores((all) => ({ ...all, [mode]: { ...all[mode], draws: all[mode].draws + 1 } }));
        } else {
            playSound(clickSound);
        }
    }

    // The CPU takes its turn after a short pause, so it feels like it's thinking
    useEffect(() => {
        if (!cpuToMove) return;
        const timer = setTimeout(() => playMove(chooseCpuMove(board, CPU, cpuLevel)), 450 + Math.random() * 300);
        return () => clearTimeout(timer);
    });

    function startRound(nextFirstPlayer) {
        playSound(resetSound);
        setBoard(EMPTY_BOARD);
        setFirstPlayer(nextFirstPlayer);
        setLevelledUp(false);
        setConfetti([]);
    }

    function handleNewRound() {
        // Take turns going first
        startRound(otherPlayer(firstPlayer));
    }

    function handleResetScores() {
        setScores((all) => ({ ...all, [mode]: EMPTY_SCORES }));
        if (vsCpu) setCpuLevel(1);
        startRound(HUMAN);
    }

    function handleModeChange(nextMode) {
        if (nextMode === mode) return;
        setMode(nextMode);
        startRound(HUMAN);
    }

    const names = vsCpu ? { X: 'You', O: 'CPU' } : { X: 'X', O: 'O' };
    let status;
    if (winner) {
        status = vsCpu ? (winner.player === HUMAN ? 'You win!' : 'CPU wins!') : `${winner.player} wins!`;
    } else if (isDraw) {
        status = "It's a draw!";
    } else if (vsCpu) {
        status = turn === HUMAN ? 'Your turn' : 'CPU is thinking';
    } else {
        status = `${turn}'s turn`;
    }

    let detail;
    if (levelledUp) {
        detail = `Level up! The CPU is now ${CPU_LEVELS[cpuLevel - 1]}`;
    } else if (isOver) {
        detail = 'Press New round to play again';
    } else {
        const left = 9 - movesMade;
        detail = `${left} ${left === 1 ? 'move' : 'moves'} left`;
    }

    const modeScores = scores[mode];
    const statusPlayer = winner ? winner.player : isOver ? null : turn;
    // Show a faint preview of your mark on hover, but not while the CPU is moving
    const ghost = !isOver && !cpuToMove ? turn : null;
    const levelName = CPU_LEVELS[cpuLevel - 1];

    return (
        <>
            <MarkGradients />
            <div className="backdrop" aria-hidden="true">
                <span className="blob blob-1" />
                <span className="blob blob-2" />
                <span className="blob blob-3" />
            </div>

            <main className="game">
                <header className="brand">
                    <span className="brand-marks" aria-hidden="true">
                        <Mark player="X" />
                        <Mark player="O" />
                    </span>
                    <span className="brand-name">Tic Tac Toe</span>
                </header>

                <div className="mode-switch" data-mode={mode} role="group" aria-label="Opponent">
                    <span className="mode-thumb" aria-hidden="true" />
                    <button aria-pressed={vsCpu} onClick={() => handleModeChange('cpu')}>
                        vs CPU
                    </button>
                    <button aria-pressed={!vsCpu} onClick={() => handleModeChange('friend')}>
                        2 players
                    </button>
                </div>

                <div className={`status${winner ? ' status-win' : ''}${isDraw ? ' status-draw' : ''}`}>
                    {statusPlayer && <Mark player={statusPlayer} className="status-mark" />}
                    <h1 aria-live="polite">
                        {status}
                        {cpuToMove && (
                            <span className="thinking" aria-hidden="true">
                                <span />
                                <span />
                                <span />
                            </span>
                        )}
                    </h1>
                </div>
                <p className={`detail${levelledUp ? ' level-up' : ''}`}>{detail}</p>

                <div className="tray">
                    <div id="board" className={winner ? 'finished' : ''} data-ghost={ghost ?? undefined}>
                        {board.map((value, i) => (
                            <button
                                key={i}
                                onClick={() => playMove(i)}
                                disabled={Boolean(value) || isOver || cpuToMove}
                                aria-label={squareLabel(i, value)}
                                className={`tile${value ? ' played' : ''}${winner?.line.includes(i) ? ' winning' : ''}`}
                            >
                                {value ? <Mark player={value} /> : ghost && <Mark player={ghost} className="ghost" />}
                            </button>
                        ))}
                        {winner && <WinLine line={winner.line} player={winner.player} />}
                    </div>
                </div>

                <div className="scoreboard" aria-label="Score">
                    <div className={`score${turn === 'X' && !isOver ? ' active' : ''}${winner?.player === 'X' ? ' won' : ''}`}>
                        <Mark player="X" className="score-mark" />
                        <span className="score-name">{names.X}</span>
                        <span className="score-value">{modeScores.X}</span>
                    </div>
                    <div className={`score${isDraw ? ' won' : ''}`}>
                        <span className="score-mark draw-mark" aria-hidden="true">=</span>
                        <span className="score-name">Draws</span>
                        <span className="score-value">{modeScores.draws}</span>
                    </div>
                    <div className={`score${turn === 'O' && !isOver ? ' active' : ''}${winner?.player === 'O' ? ' won' : ''}`}>
                        <Mark player="O" className="score-mark" />
                        <span className="score-name">{names.O}</span>
                        <span className="score-value">{modeScores.O}</span>
                    </div>
                </div>

                {vsCpu && (
                    <div className="cpu-level">
                        <span className="cpu-level-label">CPU</span>
                        <span className="level-meter" role="img" aria-label={`CPU level ${cpuLevel} of ${CPU_LEVELS.length}`}>
                            {CPU_LEVELS.map((name, i) => (
                                <span key={name} className={i < cpuLevel ? 'segment on' : 'segment'} />
                            ))}
                        </span>
                        <span className="level-name" key={levelName}>
                            {levelName}
                        </span>
                    </div>
                )}

                <div className="controls">
                    <button className="candy primary" onClick={handleNewRound}>
                        New round
                    </button>
                    <button className="candy secondary" onClick={handleResetScores}>
                        Reset scores
                    </button>
                </div>
            </main>

            <Confetti pieces={confetti} />
        </>
    );
}

export default App;
