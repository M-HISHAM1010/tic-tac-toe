const statusElement = document.getElementById("status");
const currentPlayerElement = document.getElementById("currentPlayer");
const restartButton = document.getElementById("restart");
const cells = Array.from(document.querySelectorAll(".cell"));

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let boardState = Array(9).fill("");
let currentPlayer = "x";
let gameActive = true;

function updateStatus(message) {
  statusElement.textContent = message;
}

function setCurrentPlayer(player) {
  currentPlayer = player;
  currentPlayerElement.textContent = player.toUpperCase();
}

function getAvailableMoves(position) {
  return position.map((value, index) => (value === "" ? index : null)).filter((move) => move !== null);
}

function findWinningLine(position, player) {
  return winningLines.find((line) =>
    line.every((index) => position[index] === player)
  );
}

function showWinningLine(line) {
  const winLine = document.getElementById("winLine");
  if (!winLine) {
    return;
  }
  winLine.className = "win-line visible";
  const lineIndex = winningLines.findIndex(
    (currentLine) => currentLine.join(",") === line.join(",")
  );
  winLine.classList.add(`line-${lineIndex}`);
}

function getRandomStartingPlayer() {
  return Math.random() < 0.5 ? "x" : "o";
}

function resetBoard() {
  boardState = Array(9).fill("");
  gameActive = true;
  const startingPlayer = getRandomStartingPlayer();
  setCurrentPlayer(startingPlayer);
  updateStatus(`Game on — ${startingPlayer.toUpperCase()} starts`);
  cells.forEach((cell) => {
    cell.classList.remove("active", "x", "o");
    cell.removeAttribute("data-symbol");
  });
  const winLine = document.getElementById("winLine");
  if (winLine) {
    winLine.className = "win-line";
  }
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (!gameActive || boardState[index]) {
    return;
  }

  applyMove(index, currentPlayer);

  const winningLine = findWinningLine(boardState, currentPlayer);
  if (winningLine) {
    updateStatus(`${currentPlayer.toUpperCase()} wins!`);
    showWinningLine(winningLine);
    gameActive = false;
    return;
  }

  if (boardState.every((value) => value)) {
    updateStatus("Tie");
    gameActive = false;
    return;
  }

  const nextPlayer = currentPlayer === "x" ? "o" : "x";
  setCurrentPlayer(nextPlayer);
  updateStatus(`${nextPlayer.toUpperCase()} turn`);
}

function applyMove(index, player) {
  boardState[index] = player;
  const cell = cells[index];
  cell.classList.add("active", player);
  cell.dataset.symbol = player.toUpperCase();
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", resetBoard);
resetBoard();
