import React from 'react'
import { Cell } from './Cell'

type GameBoardProps = {
  board: CellType[][]
  onCellClick: (row: number, col: number) => void
  onCellRightClick: (e: React.MouseEvent, row: number, col: number) => void
}

export function GameBoard({ board, onCellClick, onCellRightClick }: GameBoardProps) {
  return (
    <div className="grid gap-1 p-4 bg-red-berry rounded-lg shadow-lg text-reindeer-brown">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onRightClick={(e) => onCellRightClick(e, rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

type CellType = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}
