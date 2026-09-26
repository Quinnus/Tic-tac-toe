export default function Confetti({ pieces }) {
    if (!pieces.length) return null;
    return (
        <div className="confetti" aria-hidden="true">
            {pieces.map((p) => (
                <span
                    key={p.id}
                    style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.round ? p.size : p.size * 0.45,
                        borderRadius: p.round ? '50%' : 2,
                        background: p.colour,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        '--drift': `${p.drift}vw`,
                        '--spin': `${p.spin}deg`,
                    }}
                />
            ))}
        </div>
    );
}
