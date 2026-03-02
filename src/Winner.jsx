function Winner(next, setMessage, setGameOver, setTurnsLeft, playSound) {


    if
    ((next[0] === "X" && next[1] === "X" && next[2] === "X") ||
        (next[3] === "X" && next[4] === "X" && next[5] === "X") ||
        (next[6] === "X" && next[7] === "X" && next[8] === "X") ||

        (next[0] === "X" && next[3] === "X" && next[6] === "X") ||
        (next[1] === "X" && next[4] === "X" && next[7] === "X") ||
        (next[2] === "X" && next[5] === "X" && next[8] === "X") ||

        (next[0] === "X" && next[4] === "X" && next[8] === "X") ||
        (next[2] === "X" && next[4] === "X" && next[6] === "X")) {
        playSound('/src/win.wav');
        setMessage("X wins!");
        setGameOver(true);
        setTurnsLeft("--------------------");
    }

    if
    ((next[0] === "O" && next[1] === "O" && next[2] === "O") ||
        (next[3] === "O" && next[4] === "O" && next[5] === "O") ||
        (next[6] === "O" && next[7] === "O" && next[8] === "O") ||

        (next[0] === "O" && next[3] === "O" && next[6] === "O") ||
        (next[1] === "O" && next[4] === "O" && next[7] === "O") ||
        (next[2] === "O" && next[5] === "O" && next[8] === "O") ||

        (next[0] === "O" && next[4] === "O" && next[8] === "O") ||
        (next[2] === "O" && next[4] === "O" && next[6] === "O")) {
        playSound('/src/win.wav');
        setMessage("O wins!");
        setGameOver(true);
        setTurnsLeft("--------------------");
    }


}

export default Winner;



