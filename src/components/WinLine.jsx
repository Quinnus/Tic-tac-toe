// Board units: each square is 10 wide with a gap of 1, so centres sit at 5, 16 and 27.
// This matches the CSS, where the gap is a tenth of a square.
const centre = (i) => ({ x: 5 + (i % 3) * 11, y: 5 + Math.floor(i / 3) * 11 });
const OVERSHOOT = 3; // run slightly past the outer squares' centres

export default function WinLine({ line, player }) {
    const start = centre(line[0]);
    const end = centre(line[2]);
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    const dx = ((end.x - start.x) / length) * OVERSHOOT;
    const dy = ((end.y - start.y) / length) * OVERSHOOT;

    return (
        <svg className={`win-line win-line-${player.toLowerCase()}`} viewBox="0 0 32 32" aria-hidden="true">
            <line x1={start.x - dx} y1={start.y - dy} x2={end.x + dx} y2={end.y + dy} pathLength="1" />
        </svg>
    );
}
