import React, { useEffect, useState } from "react";
import "./App.css";

// Color palette based on requirements
const COLORS = {
  primary: "#1976D2",
  secondary: "#FFFFFF",
  accent: "#FF5722",
  winHighlight: "#B9F6CA", // Light mint green for winning combination
  boardBg: "#F5F7FA",
  cellBg: "#FFFFFF",
  border: "#e0e0e0",
};

// PUBLIC_INTERFACE
function App() {
  /**
   * Minimalistic, responsive Tic Tac Toe 2-player game
   * - Board centered, score above, controls below, responsive for mobile/desktop
   */

  // 0: empty, 1: "X", 2: "O"
  const emptyBoard = Array(9).fill(0);

  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true); // True: X's turn, False: O's turn
  const [winner, setWinner] = useState(null); // null | 1 | 2
  const [winningCombo, setWinningCombo] = useState([]);
  const [draw, setDraw] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [gameActive, setGameActive] = useState(true);
  const [moveCount, setMoveCount] = useState(0);

  // Winning positions
  const WINNING_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    if (!gameActive || board[index] !== 0) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 1 : 2;
    setBoard(newBoard);
    setXIsNext((prev) => !prev);
    setMoveCount(moveCount + 1);
  }

  // PUBLIC_INTERFACE
  function calculateWinner(b) {
    for (const pattern of WINNING_PATTERNS) {
      const [a, bIdx, c] = pattern;
      if (
        b[a] &&
        b[a] === b[bIdx] &&
        b[a] === b[c]
      ) {
        return { player: b[a], combo: pattern };
      }
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setWinner(null);
    setWinningCombo([]);
    setDraw(false);
    setGameActive(true);
    setMoveCount(0);
  }

  // PUBLIC_INTERFACE
  function handleReplay() {
    resetGame();
  }

  // Effects for winner/draw detection
  useEffect(() => {
    // Only check for winner if enough moves
    if (moveCount >= 5) {
      const result = calculateWinner(board);
      if (result) {
        setWinner(result.player);
        setWinningCombo(result.combo);
        setGameActive(false);
        setScore((prev) => {
          const player = result.player === 1 ? "X" : "O";
          return { ...prev, [player]: prev[player] + 1 };
        });
        return;
      }
    }
    // Draw check
    if (moveCount === 9 && !winner) {
      setDraw(true);
      setGameActive(false);
    }
  }, [board, moveCount]);

  // Helpers for UI
  function renderCell(idx) {
    let valueStr = "";
    if (board[idx] === 1) valueStr = "X";
    else if (board[idx] === 2) valueStr = "O";

    const isWinningCell = winningCombo.includes(idx);
    return (
      <button
        key={idx}
        className={`ttt-cell${isWinningCell ? " win" : ""}`}
        style={{
          background: isWinningCell
            ? COLORS.winHighlight
            : COLORS.cellBg,
          color:
            board[idx] === 1
              ? COLORS.primary
              : board[idx] === 2
              ? COLORS.accent
              : "#444",
          borderColor: COLORS.border,
          transition: "background 0.2s, color 0.2s",
        }}
        onClick={() => handleCellClick(idx)}
        disabled={board[idx] !== 0 || !gameActive}
        aria-label={
          valueStr
            ? `Cell ${idx + 1}, ${valueStr}`
            : `Cell ${idx + 1}, empty`
        }
      >
        {valueStr}
      </button>
    );
  }

  // UI Main return
  return (
    <div className="ttt-root">
      <main className="ttt-main-container">
        <div className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-scoreboard">
            <span
              className={`ttt-score-label ${
                xIsNext && gameActive ? "ttt-active" : ""
              }`}
            >
              X
              <span className="ttt-score-num">{score.X}</span>
            </span>
            <span className="ttt-score-divider">-</span>
            <span
              className={`ttt-score-label ${
                !xIsNext && gameActive ? "ttt-active" : ""
              }`}
            >
              O
              <span className="ttt-score-num">{score.O}</span>
            </span>
          </div>
        </div>
        <div className="ttt-status-area" role="status" aria-live="polite">
          {winner && (
            <span className="ttt-status-win">
              {winner === 1 ? "X" : "O"} wins!
            </span>
          )}
          {!winner && draw && (
            <span className="ttt-status-draw">Draw!</span>
          )}
          {!winner && !draw && (
            <span className="ttt-status-turn">
              Turn: <span className="ttt-active-player">{xIsNext ? "X" : "O"}</span>
            </span>
          )}
        </div>
        <div className="ttt-board" role="grid">
          {Array(3)
            .fill(0)
            .map((_, row) => (
              <div className="ttt-board-row" key={row} role="row">
                {Array(3)
                  .fill(0)
                  .map((_, col) =>
                    renderCell(row * 3 + col)
                  )}
              </div>
            ))}
        </div>
        <div className="ttt-controls">
          <button className="ttt-btn accent" onClick={handleReplay}>
            {winner || draw ? "Replay Game" : "Reset"}
          </button>
        </div>
        <footer className="ttt-footer">
          <span>
            <a
              href="https://reactjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="ttt-footer-link"
            >
              Made with React
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
