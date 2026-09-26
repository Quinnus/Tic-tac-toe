const COLOURS = ['var(--x-1)', 'var(--x-2)', 'var(--o-1)', 'var(--o-2)', 'var(--accent)', 'var(--accent-2)', '#ffd166'];

// Made when a round is won (in an event handler, not during render), then drawn by <Confetti />
export function makeConfetti(count = 70) {
    return Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.8 + Math.random() * 1.4,
        drift: (Math.random() - 0.5) * 30,
        spin: (Math.random() - 0.5) * 1440,
        size: 6 + Math.random() * 8,
        round: Math.random() < 0.35,
        colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
    }));
}
