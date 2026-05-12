const MOCK_PROPERTIES = [
  { id: 'product_name', label: 'Product Name' },
  { id: 'color', label: 'Color' },
  { id: 'weight', label: 'Weight (oz)' },
  { id: 'category', label: 'Category' },
  { id: 'wireless', label: 'Wireless' },
]

export function PropertySelect() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" htmlFor="property-select">
        Property
      </label>
      <select
        id="property-select"
        defaultValue=""
        className="border border-input rounded-md px-3 py-2 bg-background text-sm min-w-44 cursor-pointer"
      >
        <option value="" disabled>
          Select a property…
        </option>
        {MOCK_PROPERTIES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  )
}
