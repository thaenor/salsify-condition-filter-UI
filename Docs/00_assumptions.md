# Assumptions

This is a software engineering exercise focused on code architecture: layered design, separation of concerns, testable domain logic, and reviewable code paths. CSS, design systems, and accessibility are secondary considerations — not because they don't matter in production, but because they're out of scope for this exercise. The real substance is in how the code is organized and tested.

The README also leaves some behaviors unspecified. In a real project, each of these would be settled with a product owner. Here we pick the simplest defensible answer, document the decision, and flag that we made a choice rather than read one.

## Summary

1. **Case-insensitive string comparison** — Both sides lowercased before comparison.
2. **Whitespace handling** — Trim user input on entry; don't modify stored data.
3. **Empty inputs and empty strings** — Empty input is not applicable; empty string is a value for "has any value". (See detail below.)
4. **Number parsing** — Accept finite non-NaN; reject empty, NaN, ±Infinity.
5. **Number comparison strictness** — Strict: `>` not `>=`, `<` not `<=`.
6. **Form state resets on selection changes** — Reset operator/value to maintain consistency. (See detail below.)
7. **Product display order** — Insertion order; no sorting.
8. **Duplicate property_id** — Rejected as malformed by validator.
9. **Multi-text input format** — Comma-separated; trim tokens; drop empty tokens.
10. **Multi-number input format** — Comma-separated; all-or-nothing parsing.
11. **Datastore freshness** — Read once at init; no reloading.
12. **Filter persistence** — In-memory only; no page-reload survival.

## String comparison: case sensitivity

**Decision.** Case-insensitive. Both sides lowercased before comparison.

**Why.** Matches user expectation — "Headphones" and "headphones" should both find the product. Case-sensitive would require UI signals that capitalization matters, which the spec doesn't ask for.

## String comparison: whitespace

**Decision.** Trim user input on entry. Do not modify stored data values.

**Why.** Trimming prevents accidental no-match from a stray trailing space.

## Empty inputs and empty strings

**Decision.** For value-matching operators (`equals`, `contains`, `is any of`), empty input means the filter is not applicable — Apply is disabled. For `has any value`, presence is structural: does a `PropertyValue` entry exist in the array? An empty string counts as a value.

**Why.** `Contains ""` would match every product with a string value; `Is any of []` is indistinguishable from mid-edit. Both are more likely unfinished input than intentional filters. `Has any value` is about field existence, not semantic truthiness — defining "emptiness" per type would require rules the spec doesn't provide.

## Number parsing

**Decision.** Accept anything `Number()` produces as finite non-NaN: `5`, `5.0`, `-3`, `1e2`, `+7`. Reject empty strings, NaN, ±Infinity.

**Why.** `Number()` is the most permissive simple parser. The data only contains small positive integers, so any format the user types won't surprise. Mistypes return a `ParseResult` error surfaced inline.

## Number comparison strictness

**Decision.** Strict: `greater_than` uses `>`, `less_than` uses `<`.

**Why.** Matches plain-English reading. Inclusive variants would have been named "at least" / "at most."

## Form state resets on selection changes

**Decision.** When property changes, both operator and value reset. When operator changes, value resets. Draft moves to the next required stage: `needs-operator` or `needs-value`.

**Why.** A new property type may not support the old operator or value (e.g., a number after switching from number to string). A new operator may change `ValueInputKind` (text → multi-text, text → none), making the old value inconsistent.

## Product display order

**Decision.** Datastore insertion order. No sorting.

**Why.** The wireframes show no sort order, the datastore returns stable order, and stable display matters more than any particular alphabetization. Sorting could be added later as a UI affordance.

## Duplicate `property_id` on a single product

**Decision.** Malformed. Infrastructure validator rejects.

**Why.** "What does Equals match if there are two values?" has no obvious right answer, and the spec is silent. Rejecting at the boundary keeps the domain simple.

## Multi-text input format

**Decision.** Comma-separated. Trim tokens. Drop empty tokens. No quoting or escaping.

**Why.** Matches the README's example (`Headphones, Keys`). Quoting is needless complication — no value in the demo data contains a comma.

## Multi-number input format

**Decision.** Comma-separated. Each token parsed by the same number parser as single input. Any failing token fails the whole input, with error referencing the offender.

**Why.** Same simplicity argument. All-or-nothing parsing avoids silently dropping data the user intended.

## Datastore freshness

**Decision.** Read once at controller init. No reloading. Datastore treated as static fixture.

**Why.** The datastore exposes synchronous getters with no change-notification mechanism. Adding polling would invent a problem the spec doesn't pose.

## Filter persistence

**Decision.** In-memory only. No page-reload survival.

**Why.** Out of scope. URL-state encoding could be added later at the application layer with no domain changes.
