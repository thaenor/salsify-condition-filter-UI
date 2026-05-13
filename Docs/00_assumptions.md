# Assumptions

This is a software engineering exercise focused on code architecture: layered design, separation of concerns, testable domain logic, and reviewable code paths. CSS, design systems, and accessibility are secondary considerations — not because they don't matter in production, but because they're out of scope for this exercise. The real substance is in how the code is organized and tested.

The original problem statement also leaves some behaviors unspecified. In a real project, each of these would be settled with a product owner. I've picked the simplest defensible answer and document the decision.

## This is just an exercise, not production ready code

For this challenge, I've put some thought into designing a good solution that solves the problem stated, but also leaves some room to grow as if this were an actual project. Some decisions were made thinking "what if in the future we want to add more filters or more categories" (for example). If this were to be a real project done in an enterprise context, there would have been design systems at play, guidelines and frameworks that would have certainly affected the look and feel of the app.

## Browser, OS, mobile and tablet compatibility

In a real scenario I would have put more time and consideration into testing across multiple browsers as well as tablet and mobile design. I considered these out of the scope of the project.

## User input: whitespace and emptiness

Applies to operators that take a value (`equals`, `contains`, `is any of`, `greater_than`, `less_than`).

**Decisions.**
1. Trim user input on entry. Stored data is not normalized at compare time.
2. After trimming, empty input means the filter is not applicable — Apply is disabled.

**Why.** Trimming prevents accidental no-match from a stray paste. Leaving stored data untouched means equality compares what's actually there — dirty data surfaces in results rather than getting silently masked. Treating post-trim empty as "not applicable" avoids ambiguity: `Contains ""` would match every product with a string value, and `Is any of []` is indistinguishable from mid-edit.

## Presence semantics: `has any value` / `has no value`

These operators take no input. Selecting the operator immediately readies the filter.

**Decision.** Presence is structural: does a `PropertyValue` entry exist in the product's array? An empty string counts as a value (the entry exists).

**Why.** `Has any value` is about field existence, not semantic truthiness. Defining "emptiness" per property type would require rules the spec doesn't provide.

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

**Why.** The spec doesn't say which value wins when a product has two entries for the same property. Rejecting bad data at the boundary means the domain never has to guess. In a realistic scenario this would have been picked up by our theoretical "data layer".

## Multi-text/number input format

**Decision.** Comma-separated. Trim strings. Drop empty strings. No quoting or escaping.

**Why.** Matches the README's example (`Headphones, Keys`). No value in the demo data contains a comma. Otherwise we would have to plan a logical separator depending on the case. Also applies to numbers since we are treating only whole numbers.

## Datastore freshness

**Decision.** Read once at controller init. No reloading. Datastore treated as static fixture.

**Why.** The datastore exposes synchronous getters with no change-notification mechanism. Adding polling would invent a problem the spec doesn't pose.

## Filter persistence

**Decision.** In-memory only. No page-reload survival.

**Why.** Out of scope. URL-state encoding could be added later at the application layer with no domain changes.
