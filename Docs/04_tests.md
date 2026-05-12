# Tests

We write tests first, then implementation. Layer by layer from the inside out — domain first (no dependencies), infrastructure next, then application controller, then UI last. By the time the View is being built, all the rules below it are correct.

## Strategy

The test pyramid is lopsided by design. The base is the domain layer — exhaustive unit tests covering every operator across every property type, and every assumption from `assumptions.md`. Above that, a thin layer of infrastructure tests for the boundary validator, then a moderate layer of controller tests against a fake datastore, then deliberately minimal UI tests focused on the dispatcher pattern.

Integration tests at the data layer protect against silent rot in the sample datastore. E2E tests are deferred.

## Domain tests

### `applyFilter` — general

- returns all products when criteria is null
- returns empty array when products is empty
- preserves input order
- does not mutate the input array

### `applyFilter` — `equals`

- string: matches exact value
- string: matches when differing only in case (see assumptions.md)
- string: trims user-supplied value before comparing
- string: does not match substring
- string: does not match products with no value for the property
- number: matches when values are equal
- number: does not match when values differ
- number: does not match products with no value for the property
- enumerated: matches selected value
- enumerated: does not match different value

### `applyFilter` — `greater_than` (number only)

- matches values strictly greater than criterion
- excludes values exactly equal to criterion
- excludes values less than criterion
- does not match products with no value for the property

### `applyFilter` — `less_than` (number only)

- matches values strictly less than criterion
- excludes values exactly equal to criterion
- excludes values greater than criterion
- does not match products with no value for the property

### `applyFilter` — `any`

- matches products that have a value for the property
- does not match products with no entry for the property
- empty-string values count as having a value (see assumptions.md)
- applies identically to string, number, and enumerated

### `applyFilter` — `none`

- matches products with no entry for the property
- does not match products that have any value, including empty string
- applies identically to string, number, and enumerated

### `applyFilter` — `in`

- string: matches any value in candidate list (case-insensitive)
- string: trims tokens in candidate list
- string: does not match values outside list
- string: handles single-element list
- number: matches any value in candidate list
- number: does not match values outside list
- enumerated: matches any selected value
- enumerated: does not match unselected values

### `applyFilter` — `contains` (string only)

- matches values containing substring (case-insensitive)
- "phone" matches "Headphones", "Cell Phone", "Telephone"
- does not match when substring absent
- does not match products with no value for the property

### `validOperatorsFor`

- string property → equals, any, none, in, contains
- number property → equals, greater_than, less_than, any, none, in
- enumerated property → equals, any, none, in
- preserves operator catalog order

### `valueInputKindFor`

- `any` / `none` → `'none'`
- string + equals → `'text'`
- string + contains → `'text'`
- number + equals → `'number'`
- number + greater_than → `'number'`
- number + less_than → `'number'`
- string + in → `'multi-text'`
- number + in → `'multi-number'`
- enumerated + equals → `'enum-single'`
- enumerated + in → `'enum-multi'`

### `parseRawValue`

- text: returns ok with trimmed string for non-empty input
- text: returns error for empty input
- text: returns error for whitespace-only input
- number: returns ok with parsed number for finite input
- number: accepts negatives, decimals, scientific notation
- number: returns error for empty input
- number: returns error for non-numeric input
- number: returns error for NaN, Infinity, -Infinity
- multi-text: parses comma-separated tokens, trimmed
- multi-text: drops empty tokens
- multi-text: returns error when result would be empty
- multi-number: parses comma-separated numeric tokens
- multi-number: returns error when any token fails, naming the offending token
- multi-number: returns error when result would be empty
- enum-single: returns ok when value is in Property.values
- enum-single: returns error when value is not in Property.values
- enum-multi: returns ok when all values are in Property.values
- enum-multi: returns error when selection is empty
- none: returns ok regardless of raw input

### `isReady` / `toCriteria`

- `isReady` returns false for needs-property, needs-operator, needs-value
- `isReady` returns true for ready
- `toCriteria` converts a ready draft to FilterCriteria, preserving all fields

## Infrastructure tests

Test against hand-built fixtures, not the real datastore.

- accepts well-formed datastore
- rejects products not an array
- rejects product missing id
- rejects product with non-numeric id
- rejects product with non-array property_values
- rejects property_value missing property_id
- rejects property_value referencing unknown property
- rejects product with duplicate property_id entries
- rejects properties not an array
- rejects property missing id, name, or type
- rejects property with unknown type
- rejects enumerated property without values array or with empty values
- rejects operators not an array
- rejects operator missing id or text
- exposes typed Product[], Property[], Operator[] on success

## Controller tests

Test against a fake in-memory datastore. No rendering — call the controller directly.

- initial state: draft.stage === 'needs-property', appliedFilter is null, products contains all rows
- setProperty: needs-property → needs-operator
- setOperator after property: needs-operator → needs-value
- setValue with valid input: needs-value → ready
- apply: moves a ready draft into appliedFilter, table updates
- clear: resets draft to needs-property, appliedFilter to null
- changing property resets operator and value
- changing operator resets value
- availableOperators reflects current property's type
- valueInputKind reflects current (property, operator) combination
- filteredProducts equals applyFilter(allProducts, appliedFilter)
- parseError set when setValue receives invalid input
- parseError cleared when setValue succeeds
- canApply false while draft incomplete or parseError present
- canApply true when draft complete and no parseError
- dataError null when datastore parses cleanly
- dataError set when validator throws at load
- products empty and canApply false when dataError is set

## UI tests

Deliberately minimal. Cover the dispatcher pattern (because that's the design) and a couple of smoke tests. No visual assertions.

- `<ValueInput kind='none'>` renders nothing or a hint
- `<ValueInput kind='text'>` renders single text input
- `<ValueInput kind='number'>` renders single number input
- `<ValueInput kind='multi-text'>` renders text input (comma-separated)
- `<ValueInput kind='multi-number'>` renders text input (comma-separated)
- `<ValueInput kind='enum-single'>` renders single-select over property values
- `<ValueInput kind='enum-multi'>` renders multi-select over property values
- `<PropertyPicker>` emits onChange with selected property's id
- `<OperatorPicker>` only lists valid operators for current property
- `<ClearButton>` calls onClear when clicked
- `<ProductTable>` renders row per product, column per property
- `<ProductTable>` renders empty state when products is []
- `<App>` smoke: pick property → pick operator → type value → table updates
- `<App>` smoke: clear after filtering returns all products

## Integration tests (data-layer validation)

Load the actual `datastore.js` and validate it parses cleanly. Catches silent rot if the datastore is ever modified.

- shipped datastore parses without errors
- 6 products, 5 properties, 7 operators with expected ids
- every PropertyValue.property_id resolves to a Property in the catalog
- every enumerated property value is in its Property.values list
- no duplicate product, property, or operator ids
- no product has duplicate property_id entries

## E2E tests (deferred, stretch goal)

- happy path: pick "Product Name" + "Equals" + "Headphones" → table shows only Headphones
- multi-value: pick "category" + "Is any of" + [tools, electronics] → excludes kitchenware
- contains: pick "Product Name" + "Contains" + "phone" → matches Cell Phone
- no value: pick "wireless" + "Has no value" → shows products without wireless value
- clear: apply filter, click Clear → all products, controls reset
- invalid number: pick "weight (oz)" + "Is greater than" + "abc" → inline error, Apply disabled

## Coverage goals

No enforced threshold, but the cases above cover:

- Every operator × every compatible property type
- Every assumption from `assumptions.md`
- Every `FilterDraft` state transition
- Every `ValueInputKind`

## Workflow

1. Pick next layer (start with domain).
2. Write failing tests from the lists above.
3. Run — they should fail. If they pass without code, the test is wrong.
4. Implement minimum code to make them pass.
5. Refactor with tests green.
6. Move to next layer.

Dependencies point inward, so each layer is testable in isolation. Domain first, then infrastructure, then controller, then UI.
