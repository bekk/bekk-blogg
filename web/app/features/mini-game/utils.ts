const BOARD_SIZE = 10
const NUM_MINES = 15

export type CellType = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export const countNeighborMines = (board: CellType[][], row: number, col: number) => {
  let count = 0
  for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
      if (board[r][c].isMine) count++
    }
  }
  return count
}

export const getNewBoard = () => {
  const newBoard = Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }))
    )

  // Place mines
  let minesPlaced = 0
  while (minesPlaced < NUM_MINES) {
    const row = Math.floor(Math.random() * BOARD_SIZE)
    const col = Math.floor(Math.random() * BOARD_SIZE)
    if (!newBoard[row][col].isMine) {
      newBoard[row][col].isMine = true
      minesPlaced++
    }
  }

  // Calculate neighbor mines
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].neighborMines = countNeighborMines(newBoard, row, col)
      }
    }
  }

  return newBoard
}

export const revealCell = (board: CellType[][], row: number, col: number) => {
  if (
    row < 0 ||
    row >= BOARD_SIZE ||
    col < 0 ||
    col >= BOARD_SIZE ||
    board[row][col].isRevealed ||
    board[row][col].isFlagged
  )
    return

  board[row][col].isRevealed = true

  if (board[row][col].neighborMines === 0) {
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        revealCell(board, r, c)
      }
    }
  }
}

export const revealAllMines = (board: CellType[][]) => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].isMine) {
        board[row][col].isRevealed = true
      }
    }
  }
}

export const checkWinCondition = (board: CellType[][]) => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col].isMine && !board[row][col].isRevealed) {
        return false
      }
    }
  }
  return true
}
