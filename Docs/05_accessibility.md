# Accessibility

Baseline a11y pass applied to the filter UI. Not exhaustive — covers the structural wins that matter most for screen reader and keyboard users.

## What we did

### 1. FilterBar landmark (`FilterBar.tsx`)

- Added `role="search"` and `aria-label="Product filter"` to the wrapper div.
- Screen readers can now jump directly to the filter controls.

### 2. Live result announcements (`ProductTable.tsx`)

- Visually-hidden `<span>` with `aria-live="polite"` announces product count on every filter change (e.g. "3 products found", "No products match the current filter").
- Sighted users see the table update; screen reader users hear the count.

### 3. InfoIcon tooltip label (`MultiInput.tsx`)

- Added `aria-label="Comma-separated values"` to the tooltip trigger button.
- Without this, the SVG icon was invisible to assistive tech.

### 4. Focus management on clear (`FilterBar.tsx`, `PropertySelect.tsx`)

- Clicking Clear moves focus back to the property select dropdown.
- Implemented via a `selectRef` prop — no forwardRef overhead.

### 5. Empty state status role (`ProductTable.tsx`)

- Added `role="status"` to the "No products to display" cell.

## What's already good (unchanged)

- All inputs have proper `<label>` + `htmlFor`/`id` binding.
- EnumMultiSelect uses `<fieldset>` + `<legend>`.
- Semantic HTML throughout: `<nav>`, `<main>`, `<table>`, `<thead>`, `<th>`.
- ClearButton has `type="button"` (won't accidentally submit forms).

## Not covered

- Full keyboard navigation audit (tab order, arrow keys in dropdowns).
- Color contrast verification.
- ARIA patterns for more complex widgets (e.g. combobox for enum multi-select).
- Automated a11y testing (axe-core / Playwright a11y assertions).
