// X and O drawn as strokes. The gradients they use are defined once in <MarkGradients />.
export function Mark({ player, className = '' }) {
    return (
        <svg className={`mark mark-${player.toLowerCase()} ${className}`.trim()} viewBox="0 0 100 100" aria-hidden="true">
            {player === 'X' ? (
                <>
                    <line className="stroke stroke-1" x1="27" y1="27" x2="73" y2="73" pathLength="1" />
                    <line className="stroke stroke-2" x1="73" y1="27" x2="27" y2="73" pathLength="1" />
                </>
            ) : (
                <circle className="stroke stroke-1" cx="50" cy="50" r="25" pathLength="1" transform="rotate(-90 50 50)" />
            )}
        </svg>
    );
}

export function MarkGradients() {
    return (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
                <linearGradient id="gradient-x" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--x-1)" />
                    <stop offset="100%" stopColor="var(--x-2)" />
                </linearGradient>
                <linearGradient id="gradient-o" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--o-1)" />
                    <stop offset="100%" stopColor="var(--o-2)" />
                </linearGradient>
            </defs>
        </svg>
    );
}
