# Conventions

Important things to settle when starting a new application:

- variable naming convention
- coding standards (e.g. when to use ternary operators vs if statements)
- how errors and edge cases are handled

## Variable naming

It's really important to establish a naming convention, particularly when working with a team. If the business states the "Product has properties", then calling them "Product-attributes" will lead to confusion and communication issues when developers need to cross with product/design.

In a more realistic scenario, these standards would have to be discussed and aligned with the team. Linters and TypeCheckers can do a lot of the heavy lifting, but it's relevant that the code reads as one, not "this part was written by X". Establishing simple rules such as "avoid ternary operators in favour of if statements" are important so that the code remains readable and accessible. Particularly more so with the introduction of agentic generative tools that input a lot of the code. The goal is to make the review process as smooth as possible.

**Files.**

- View components: `PascalCase` (`FilterBar.tsx`, `ValueInput.tsx`).
- Modules and controllers: `camelCase` (`filter.ts`, `filterReducer.ts`).
- Tests: `*.test.ts` / `*.test.tsx`, co-located in a `__tests__/` folder beside the module under test.
- Type-only files: `types.ts` or co-located with the implementing module.

**Functions.**

- Predicates return boolean, start with `is`, `has`, or `can` (`isReady`, `hasValueFor`, `canApply`).
- Mutations and side-effects use verb-first imperative names (`applyFilter`, `parseRawValue`, `setOperator`).
- Pure derivations read as nouns or short phrases (`valueInputKindFor`, `filteredProducts`).

**View events.**

- Incoming props: `onSomething` (`onChange`, `onApply`).
- Internal handlers: `handleSomething` (`handleChange`, `handleApply`).
- Application-layer functions wired directly to UI events also use `handleSomething` (`handlePropertySelection`, `handleApply`). Use `handleSomething` when the function is the direct callback for a user interaction; use a plain verb-first name (`selectProperty`, `applyFilter`) when the function is a domain operation that may be called from multiple contexts.

**Types and tagged unions.**

- Type names: `PascalCase` (`Product`, `FilterCriteria`, `ValueInputKind`).
- Discriminator field: always `kind` (not `type`, which collides with `Property.type`).

**Constants.**

- Lookup tables and configuration-like maps: `SCREAMING_SNAKE_CASE` (`COMPATIBILITY`, `VALUE_INPUT_MAP`).
- Data-like arrays and initial values: `camelCase` (`operators`, `initialState`).

**Wire vs internal field naming.**

- External data uses whatever naming the source provides. The data layer maps to camelCase and to the domain's vocabulary before anything crosses into application or domain code. No other layer references external field names. This keeps domain knowledge consistent — if we call something a "property," the app never knows it as an "attribute," even if a backend source uses that term.

**No abbreviations** unless universal. `id`, `url`, `db` are fine. `prop`, `op`, `el` are not — use `property`, `operator`, `element`.

## Exports

- **Prefer named exports.** Consistent import names across the codebase, better IDE autocompletion, and easier to grep.
- **Exceptions:** `App` (Vite convention) and `datastore` use default exports. Not worth changing, but new modules should use named exports.

## Error handling

- **Domain errors are values, not exceptions.** `parseRawValue` returns `ParseResult<T>` — a tagged union with `{ ok: true, value }` or `{ ok: false, error }`. No `try/catch` in the domain.
- **The reducer stores parse errors** alongside the draft in `ControllerState.parseError`. A failed parse regresses the draft to `needs-value` and sets the error string.
- **The UI renders errors inline** via `role="alert"`, which also announces to screen readers. Errors clear automatically when the user changes property, operator, or successfully commits a value.

## Component structure

- **One component per file.** No multi-component files.
- **Props as `interface` above the component**, not inline or in a separate file.
- **`interface` for object shapes, `type` for unions and aliases.** e.g. `interface Product { ... }` but `type FilterDraft = ... | ...`.
- **Local state only for raw UI input** (text the user is typing). Parsed/validated state lives in the reducer.

## Code style

- **Avoid ternaries for control flow.** Use `if`/`else` or `switch` for branching logic. Ternaries are acceptable for simple inline expressions in JSX (e.g. `condition ? <A /> : <B />`), not for side effects or multi-line logic.
- **Prefer `switch` over `if`/`else` chains** when dispatching on a discriminator (`kind`, `stage`, `type`). Exhaustiveness checking catches missing cases at compile time.
- **No implicit returns with side effects.** Arrow functions with implicit returns should be pure expressions only.

## Testing

- **jsdom is scoped per component test file**, not global. Each component test includes `// @vitest-environment jsdom` at the top. Domain and application tests run without jsdom — they don't need a DOM and this avoids unnecessary memory overhead.
- **Tests co-located in `__tests__/`** beside the module under test, not in a separate top-level test directory.
- **E2E tests live in `e2e/`** at the project root, separate from unit tests. They run via Playwright against the dev server.

## Explicitly deferred

Production concerns deliberately not built.

- **Internationalization** — English only, hardcoded inline, no
  locale-aware formatting or RTL support.
- **Performance** — No budgets, no virtualization, no code splitting.
- **CSS architecture** — No design tokens, theming, dark mode, or
  responsive breakpoints. Desktop-first.
- **State persistence** — In-memory only. No URL encoding, no
  localStorage.
- **Automated a11y / visual regression testing** — Baseline a11y is
  in place (see [06_accessibility.md](./06_accessibility.md)), but no
  accessibility integration tests or visual regression tooling.
- **Security, SEO, PWA, compliance** — None in scope.

## Formatting

- **Prettier is the canonical formatter.** Run `npm run format` to auto-fix all files.
- **Quality gate.** `npm run check` runs `tsc --noEmit`, `vitest run`, `eslint .`, and `prettier --check .` in sequence.
