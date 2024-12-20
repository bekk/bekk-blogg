import { FlagIcon, GiftIcon, TreePineIcon } from 'lucide-react'

type CellProps = {
  cell: CellType
  onClick: () => void
  onRightClick: (e: React.MouseEvent) => void
}

export function Cell({ cell, onClick, onRightClick }: CellProps) {
  const getCellContent = () => {
    if (cell.isFlagged) return <FlagIcon className="w-4 h-4 text-red-500" />
    if (!cell.isRevealed) return null
    if (cell.isMine) return <GiftIcon className="w-4 h-4 text-red-500" />
    if (cell.neighborMines > 0) return cell.neighborMines
    return <TreePineIcon className="w-4 h-4 text-green-500" />
  }

  const getCellClass = () => {
    let className = 'w-8 h-8 flex items-center justify-center text-sm font-bold rounded'
    if (!cell.isRevealed) {
      className += ' bg-white hover:bg-gray-100 cursor-pointer'
    } else if (cell.isMine) {
      className += ' bg-red-500 text-white'
    } else {
      className += ' bg-green-100'
    }
    return className
  }

  return (
    <button className={getCellClass()} onClick={onClick} onContextMenu={onRightClick}>
      {getCellContent()}
    </button>
  )
}

type CellType = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}
