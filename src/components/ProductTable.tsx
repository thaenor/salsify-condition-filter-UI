const COLUMNS = ['Product ID', 'Product Name', 'Color', 'Weight (oz)', 'Category']

export function ProductTable() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} className="text-left px-4 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={COLUMNS.length}
              className="text-center text-muted-foreground px-4 py-10"
            >
              No products to display.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
