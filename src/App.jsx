import React, { useState } from 'react';
import './App.css';
import Winner from './Winner';

function App() {
  const [entry, setEntry] = useState(Array(9).fill("⭐️"));
  const [turn, setTurn] = useState("X");
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("X plays first");
  const [gameOver, setGameOver] = useState(false);
  const [turnsLeft, setTurnsLeft] = useState((9 - count) + " turns left!")


  function playSound(file) {
    const audio = new Audio(file);
    audio.play();
  }

  function handleClick(n) {
    if (!gameOver) {
      const next = entry.slice();
      if (next[n] === "X" || next[n] === "O") return;

      playSound('/src/click.wav');

      next[n] = turn;
      const newCount = count + 1;
      const nextTurn = turn === "X" ? "O" : "X";


      setEntry(next);
      setCount(newCount);
      setTurn(nextTurn);

      setMessage(`${nextTurn}` + "'s turn next");
      const newTurnsLeft = 9 - newCount;
      setTurnsLeft(newTurnsLeft + " turns left!")
      Winner(next, setMessage, setGameOver, setTurnsLeft, playSound);
      if (newCount === 9 && !gameOver) {
        setMessage("It's a tie!");
        setTurnsLeft("--------------------");
        setGameOver(true);
      }
    }


  }

  function handleReset() {
    playSound('/src/reset.wav');
    document.body.style.opacity = "0";
    setTimeout(() => window.location.reload(), 150);
  }






  return (
    <>
      <h1>{message}</h1>
      <h3>{turnsLeft}</h3>
      <div id="board">
        {entry.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={
              val === "⭐️" ? "" : `played ${val === "X" ? "x" : "o"}`
            }
          >
            {val}
          </button>

        ))}
        <br></br>
        <button className="reset" onClick={handleReset}>Reset</button>
      </div>
    </>
  )
}

export default App
