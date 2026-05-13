# Tests

TDD throughout. Tests were written before implementation for every layer.

## Structure

Tests live next to what they cover:

- `src/domain/__tests__/` — business rules (filter logic, operator compatibility, value parsing)
- `src/application/__tests__/` — state machine (reducer transitions, draft lifecycle)
- `src/components/__tests__/` — UI components (rendering, user interaction, commit behavior)

## Domain tests

The bulk of the coverage. These exercise `applyFilter`, `valueInputKindFor`, `parseRawValue`, and the compatibility map. Covers all operator types across string, number, and enumerated properties — including edge cases like missing property values, single-element `in` lists, and case sensitivity.

## Application tests

The `filterReducer` is tested as a pure function. Each action type (`selectProperty`, `selectOperator`, `setValue`, `clear`) has cases for valid transitions, no-ops, and resets.

## Component tests

Each input component is tested in isolation with `@testing-library/react`. The jsdom environment is scoped per-file (not global) to keep domain tests lightweight. Tests verify rendering, local state tracking, and the commit-on-blur/Enter pattern used by text and number inputs.

## What's not covered (yet)

No E2E tests at the moment. Planning to add them next to cover the full user flow — selecting a property, choosing an operator, entering a value, and verifying the filtered results. Will also use them to catch a few edge cases that are hard to unit test in isolation.

The infrastructure layer (datastore) is untested by design — it's a static mock with no logic worth testing.
