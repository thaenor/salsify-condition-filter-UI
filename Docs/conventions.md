# Conventions

Cross-cutting rules. How errors move through the app, how things are named, and what we are explicitly *not* building.

## Error handling

### The taxonomy

There are three kinds of failure, and they take three different paths:

**1. Programmer errors (bugs).** A `null` where a `Product` was promised. An unknown operator id reaching the filter engine. An exhaustive switch hitting its default. These should not "trickle to the UI as a recoverable error state" — they should fail loudly in development (throw, surface in console) and in production get caught by a root-level error boundary that renders a generic fallback. Recovering from them inside business logic is wrong; we want the noise.

**2. User input errors (parse failures).** The user typed `abc` in a number field. This is not an "error" in the application sense — it's an ordinary UI state. The domain returns a `ParseResult<T>` from `parseRawValue`, the application layer surfaces the message, and the View renders it inline next to the offending input. Apply is disabled while a parse error is present. No exceptions. Nothing touches the logger.

**3. System / boundary errors (malformed datastore).** Shape validation at the infrastructure boundary fails. Rare and catastrophic. The validator throws; the application layer catches at load time, logs via the logger port, and exposes a `dataError` state. The View renders a catastrophic message ("Products couldn't be loaded"). The user has no recovery path.

### The rules

- **Logger port.** A `logger` module exposes `error(message, context?)`, `warn(message, context?)`, `info(message, context?)`. Implementation writes to console today, swappable later. Domain and infrastructure may call the logger. View components should not — they communicate through the application controller.
- **Domain functions never throw on valid inputs.** Their signatures are total. Where valid input can legitimately fail to produce a value (parsing raw user input), they return `ParseResult<T>` rather than throwing.
- **Infrastructure validators throw on malformed data.** This is a programmer-error path. The throw is caught once, at application controller load.
- **One root error boundary.** Wraps the view tree. Catches anything unexpected. Logs the error via the logger port. Renders a generic fallback.
- **Disabled-Apply over silent failure.** When the draft is incomplete or has a parse error, Apply is disabled. The user should not be able to click and see nothing happen.
- **No silent catch-and-continue.** If a domain function ever needs `try/catch`, the type contract is wrong. Fix the contract, don't swallow the error.

## Naming

**Files.**
- View components: `PascalCase` (`FilterBar.js`, `ValueInput.js`).
- Modules and controllers: `camelCase` (`filter.js`, `filterController.js`).
- Tests: `*.test.js`, co-located in a `__tests__/` folder beside the module under test.
- Type-only files: `types.js` or co-located with the implementing module.

**Functions.**
- Predicates return boolean, start with `is`, `has`, or `can` (`isReady`, `hasValueFor`, `canApply`).
- Mutations and side-effects use verb-first imperative names (`applyFilter`, `parseRawValue`, `setOperator`).
- Pure derivations read as nouns or short phrases (`validOperatorsFor`, `valueInputKindFor`, `filteredProducts`).

**View events.**
- Incoming props: `onSomething` (`onChange`, `onApply`).
- Internal handlers: `handleSomething` (`handleChange`, `handleApply`).

**Types and tagged unions.**
- Type names: `PascalCase` (`Product`, `FilterCriteria`, `ValueInputKind`).
- Discriminator field: always `kind` (not `type`, which collides with `Property.type`).

**Constants.**
- Typed objects (compatibility maps, operator catalogs): `PascalCase` (`Compatibility`, `Operators`).
- Primitives and simple arrays: `SCREAMING_SNAKE_CASE` (`MAX_PRODUCTS`).

**Wire vs internal field naming.**
- External data uses whatever naming the source provides. The data layer maps to camelCase and to the domain's vocabulary before anything crosses into application or domain code. No other layer references external field names. This keeps domain knowledge consistent — if we call something a "property," the app never knows it as an "attribute," even if a backend source uses that term.

**No abbreviations** unless universal. `id`, `url`, `db` are fine. `prop`, `op`, `el` are not — use `property`, `operator`, `element`.

**Comments on assumptions.** Every code path depending on a documented assumption from `assumptions.md` carries a short comment referencing it: `// Assumes case-insensitive — see assumptions.md#string-comparison-case-sensitivity`.

## Explicitly deferred

Production concerns we are deliberately not building. Listing them
shows awareness of scope, not intent to build.

- **Accessibility** — Semantic HTML where free, but no WCAG audit,
  ARIA live regions, or assistive technology testing.
- **Internationalization** — English only, hardcoded inline, no
  locale-aware formatting or RTL support.
- **Performance** — No budgets, no virtualization, no code splitting.
  Six rows doesn't need it.
- **CSS architecture** — No design tokens, theming, dark mode, or
  responsive breakpoints. Desktop-first.
- **CI/CD and tooling** — Default bundler config, no pipeline, no
  quality gates, no deploy target.
- **State persistence** — In-memory only. No URL encoding, no
  localStorage.
- **Testing beyond unit tests** — No visual regression, no automated
  a11y, no performance regression. E2E deferred as stretch goal.
- **Security, SEO, PWA, compliance** — None in scope.
