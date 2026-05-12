# Conventions

Important things to settle when starting a new application:

- variable naming convention
- coding standards (e.g. when to use ternary operators vs if statements)
- how errors and edge cases are handled

## Variable naming

It's really important to establish a naming convention, particularly when working with a team. If the business states the "Prodcut has properties", then calling them "Product-attributes" will lead to confusion and communication issues when developers need to cross with product/design.

In a more realistic scenario, these standards would have to be discussed and alligned with the team. Linters and TypeCheckers can do a lot of the heavy lifting, but it's relevant that the code reads as one, not "this part was written by X". Establishing simple rules such as "avoid ternary operators in favour or if statements" are important so that the code remains readable and acessible. Particularly more so with the introduction of agentic generative tools that input a lot of the code. The goal is to make the review process as smooth as possible.

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
- Application-layer functions wired directly to UI events also use `handleSomething` (`handlePropertySelection`, `handleApply`). Use `handleSomething` when the function is the direct callback for a user interaction; use a plain verb-first name (`selectProperty`, `applyFilter`) when the function is a domain operation that may be called from multiple contexts.

**Types and tagged unions.**

- Type names: `PascalCase` (`Product`, `FilterCriteria`, `ValueInputKind`).
- Discriminator field: always `kind` (not `type`, which collides with `Property.type`).

**Constants.**

- Typed objects (compatibility maps, operator catalogs): `PascalCase` (`Compatibility`, `Operators`).
- Primitives and simple arrays: `SCREAMING_SNAKE_CASE` (`MAX_PRODUCTS`).

**Wire vs internal field naming.**

- External data uses whatever naming the source provides. The data layer maps to camelCase and to the domain's vocabulary before anything crosses into application or domain code. No other layer references external field names. This keeps domain knowledge consistent — if we call something a "property," the app never knows it as an "attribute," even if a backend source uses that term.

**No abbreviations** unless universal. `id`, `url`, `db` are fine. `prop`, `op`, `el` are not — use `property`, `operator`, `element`.

## Error handling

TODO

## Explicitly deferred

Production concerns deliberately not built.

- **Accessibility** — Semantic HTML where free, but no WCAG audit,
  ARIA live regions, or assistive technology testing.
- **Internationalization** — English only, hardcoded inline, no
  locale-aware formatting or RTL support.
- **Performance** — No budgets, no virtualization, no code splitting.
- **CSS architecture** — No design tokens, theming, dark mode, or
  responsive breakpoints. Desktop-first.
- **CI/CD and tooling** — No pipeline, no deploy target.
- **State persistence** — In-memory only. No URL encoding, no
  localStorage.
- **Testing beyond unit tests** — No visual regression, no automated
  a11y, no performance regression. E2E deferred as stretch goal.
- **Security, SEO, PWA, compliance** — None in scope.

## Formatting

- **Prettier is the canonical formatter.** Run `npm run format` to auto-fix all files. Never configure ESLint style rules — Prettier owns all formatting decisions (`eslint-config-prettier` disables any conflicts).
- **Quality gate.** `npm run check` runs `tsc --noEmit`, `vitest run`, `eslint .`, and `prettier --check .` in sequence. All four must pass before every commit.
