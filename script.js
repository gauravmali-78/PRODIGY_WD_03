const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const aiModeCheckbox = document.getElementById("ai-mode");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let aiMode = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Check for a winner
function checkWinner() {
  let winner = null;

  winningConditions.forEach((condition) => {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      winner = gameState[a];
      condition.forEach((index) => {
        cells[index].classList.add("winning");
      });
    }
  });

  if (winner) {
    statusText.textContent = `${winner} wins!`;
    board.classList.add("disabled");
    return true;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    return true;
  }

  return false;
}

// AI Move
function aiMove() {
  const emptyCells = gameState
    .map((value, index) => (value === "" ? index : null))
    .filter((value) => value !== null);

  if (emptyCells.length > 0) {
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = currentPlayer;

    const cell = cells[randomIndex];
    const marker = document.createElement("span");
    marker.textContent = currentPlayer;
    marker.style.color = currentPlayer === "X" ? "#ff6347" : "#4682b4";
    cell.appendChild(marker);

    cell.classList.add("taken");

    if (!checkWinner()) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

// Handle user clicks
function handleClick(event) {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (gameState[index] || board.classList.contains("disabled")) return;

  gameState[index] = currentPlayer;

  const marker = document.createElement("span");
  marker.textContent = currentPlayer;
  marker.style.color = currentPlayer === "X" ? "#ff6347" : "#4682b4";
  cell.appendChild(marker);

  cell.classList.add("taken");

  if (!checkWinner()) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (aiMode && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }
}

// Reset game
function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  statusText.textContent = "Player X's turn";
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken", "winning");
  });
  board.classList.remove("disabled");
}

// Event listeners
cells.forEach((cell) => cell.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);
aiModeCheckbox.addEventListener("change", (e) => {
  aiMode = e.target.checked;
  resetGame();
});
