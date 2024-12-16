import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table'

type TableProps = {
  data: {
    rows: { cells: string[] }[]
  }
}
export const TableBlock = ({ data }: TableProps) => {
  if (!data.rows?.length) {
    return null
  }
  return (
    <div className="overflow-x-auto">
      <Table className="table-auto w-full text-sm">
        <TableBody>
          {data.rows.map((row, index) => (
            <TableRow key={index}>
              {row.cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
