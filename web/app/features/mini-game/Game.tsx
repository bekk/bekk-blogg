import { Link } from 'react-router'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { GameBoard } from './GameBoard'
import { GameHeader } from './GameHeader'
const BOARD_SIZE = 10
const NUM_MINES = 15

export function ChristmasMinesweeper() {
  const [board, setBoard] = useState<CellType[][]>([])
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [santaHelperAvailable, setSantaHelperAvailable] = useState(true)

  const initializeBoard = useCallback(() => {
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

    setBoard(newBoard)
    setGameStatus('playing')
    setSantaHelperAvailable(true)
  }, [])

  useEffect(() => {
    initializeBoard()
  }, [initializeBoard])

  const countNeighborMines = (board: CellType[][], row: number, col: number) => {
    let count = 0
    for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
        if (board[r][c].isMine) count++
      }
    }
    return count
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing') return

    const newBoard = [...board]
    if (newBoard[row][col].isMine) {
      revealAllMines(newBoard)
      setGameStatus('lost')
    } else {
      revealCell(newBoard, row, col)
      if (checkWinCondition(newBoard)) {
        setGameStatus('won')
      }
    }
    setBoard(newBoard)
  }

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameStatus !== 'playing') return

    const newBoard = [...board]
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    setBoard(newBoard)
  }

  const revealCell = (board: CellType[][], row: number, col: number) => {
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

  const revealAllMines = (board: CellType[][]) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col].isMine) {
          board[row][col].isRevealed = true
        }
      }
    }
  }

  const checkWinCondition = (board: CellType[][]) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          return false
        }
      }
    }
    return true
  }

  const handleSantaHelper = () => {
    if (!santaHelperAvailable || gameStatus !== 'playing') return

    const safeCells = board
      .flatMap((row, rowIndex) => row.map((cell, colIndex) => ({ row: rowIndex, col: colIndex, cell })))
      .filter(({ cell }) => !cell.isMine && !cell.isRevealed)

    if (safeCells.length > 0) {
      const randomSafeCell = safeCells[Math.floor(Math.random() * safeCells.length)]
      const newBoard = [...board]
      revealCell(newBoard, randomSafeCell.row, randomSafeCell.col)
      setBoard(newBoard)
      setSantaHelperAvailable(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#d0332e] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-green-300 mb-4">Julesveiper</h1>
      <GameHeader
        gameStatus={gameStatus}
        onReset={initializeBoard}
        onSantaHelper={handleSantaHelper}
        santaHelperAvailable={santaHelperAvailable}
      />
      <GameBoard board={board} onCellClick={handleCellClick} onCellRightClick={handleCellRightClick} />
      <div className="text-center mt-8">
        <Button asChild variant="secondary">
          <Link to="/">Tilbake til julekalenderen</Link>
        </Button>
      </div>
    </div>
  )
}

type CellType = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}
