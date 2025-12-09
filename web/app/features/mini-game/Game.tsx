import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { GameBoard } from './GameBoard'
import { GameHeader } from './GameHeader'
import { CellType, checkWinCondition, getNewBoard, revealAllMines, revealCell } from './utils'

export function ChristmasMinesweeper() {
  const [board, setBoard] = useState<CellType[][]>(getNewBoard())
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [santaHelperAvailable, setSantaHelperAvailable] = useState(true)

  const initializeBoard = useCallback(() => {
    const newBoard = getNewBoard()

    setBoard(newBoard)
    setGameStatus('playing')
    setSantaHelperAvailable(true)
  }, [])

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
