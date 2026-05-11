# Risk Register

Plausible future requirements that would put pressure on the architecture. Naming them validates that our seams are right (most changes land in one layer) and pre-mortems cases where we'd need a larger refactor.

Each entry: risk → likelihood → impact → where the change lands → mitigation already in place.

## R1. Compound filters (AND/OR composition)

**Likelihood:** High long-term. Out of scope now.

**Impact:** Medium.

**Where:** `FilterCriteria` type extends to tree with combinators. `applyFilter` becomes recursive. `FilterDraft` state machine grows add/remove criteria support. UI gains compound components. Per-criterion value-input dispatcher unchanged.

**Mitigation:** `FilterCriteria` is already `null | { ... }` — a `{ kind: 'compound', combinator, children }` variant extends without changing the predicate signature. Domain remains the only place that understands the new shape.

## R2. Async or paginated datastore

**Likelihood:** High if this becomes a real product.

**Impact:** Low–medium.

**Where:** Infrastructure wrapper goes async. Controller gains loading/error states. Domain unchanged (`applyFilter` still takes an array). UI gains loading indicator and error fallback.

**Mitigation:** Infrastructure boundary is the sole datastore touchpoint. Controller already centralizes data+state joining. Domain has no awareness of data provenance.

## R3. New property types

**Likelihood:** Medium. Spec says no, but real Salsify likely has more.

**Impact:** Medium.

**Where:** `PropertyType` union, `COMPATIBILITY` map, `valueInputKindFor` dispatch gain entries. Predicate semantics may need extension. `ValueInputKind` gets new kinds. View gets corresponding subcomponents. Validator gains shape checks.

**Mitigation:** Compatibility is data, not branching code. ValueInputKind is a union with single dispatch point. Adding a type is localized additions, not a refactor.

## R4. New operators

**Likelihood:** Low for exercise, medium in real product.

**Impact:** Low if value shape matches existing kind; medium if new kind needed.

**Where:** Operator catalog, `OperatorId` union, predicate dispatch, `COMPATIBILITY` map, possibly `valueInputKindFor` and `parseRawValue`. View only changes if new kind needed.

**Mitigation:** Predicate dispatch is one switch. `OperatorId` is exhaustive at type level — missing case flagged everywhere. No silent forgetting.

## R5. Large product catalogs

**Likelihood:** High in real Salsify.

**Impact:** High without preparation.

**Where:** Infrastructure may delegate filtering to backend. Controller gains pagination. UI gains virtualization. Domain may shift from evaluator to criteria serializer — conceptual shift.

**Mitigation:** Filter engine is a pure function with clean signature. Replacing client-side with server-side doesn't change View or controller shape — only implementation behind the boundary. Criteria shape becomes a serialization contract to pin down if this happens.

## R6. Internationalization

**Likelihood:** Medium–high in real product.

**Impact:** Medium–high to retrofit; low if designed in.

**Where:** English strings → message catalog. Operator labels need locale keying. Number parsing may need locale awareness. Layout may break in RTL.

**Mitigation:** Limited. Hardcoded copy is contained in View layer, so retrofit is at least localized. A `Strings` constants module would make eventual translation mechanical.

## R7. Filter persistence (URL state, saved filters, undo/redo)

**Likelihood:** Medium.

**Impact:** Low–medium.

**Where:** Controller gains serialize/deserialize against URL or storage. FilterCriteria becomes stable contract. Small history stack for undo in controller.

**Mitigation:** Controller centralizes state — persistence hooks in naturally. Criteria type is JSON-friendly. No domain or UI changes needed.

## R8. Multiple concurrent filter editors

**Likelihood:** Low.

**Impact:** Very low.

**Where:** Nowhere significant. Controller is local-scope by construction.

**Mitigation:** State lives in the controller, which is per-instance. No global singleton. Multiple instances coexist freely.

## R9. Real-time data updates

**Likelihood:** Low for exercise, medium in real product.

**Impact:** Medium.

**Where:** Infrastructure gains subscription. Controller re-evaluates filteredProducts on data change. Hardest case: property being filtered by gets deleted — controller detects and clears filter with message.

**Mitigation:** `filteredProducts` is already derived from primary state — if products array becomes reactive, existing derivation recomputes for free. Property-deletion case needs explicit handling.

## R10. Accessibility requirements (WCAG 2.2 AA)

**Likelihood:** Certain in real customer-facing context.

**Impact:** Medium–high to retrofit; low to design in.

**Where:** All UI components. Custom widgets need keyboard model. Live regions announce changes. Focus management on Apply/Clear.

**Mitigation:** None for this exercise — explicitly deferred (see conventions.md). Designed-in a11y is ~2 weeks at project start.

## R11. Design system / visual consistency

**Likelihood:** Certain in real context.

**Impact:** Low–medium.

**Where:** View only. Components retheme via tokens.

**Mitigation:** All visual decisions confined to View layer. No styling logic in domain or controller.

## R12. Test brittleness as View grows

**Likelihood:** Medium over time.

**Impact:** Medium.

**Where:** Test suite itself.

**Mitigation:** Tests.md keeps UI tests minimal and behavior-focused. Domain and controller tests own correctness. Dispatcher pattern means most UI logic is "render the right kind" — testable as kind→component map.

---

The mitigations cluster around three structural choices: four-layer split (changes touch one layer), data-driven dispatch (adding operators/types/kinds is localized), and discriminated unions (variants extend rather than refactor). The genuinely exposed risks — large catalogs, accessibility, i18n — are named honestly here. They'd be the first investments if this grew into a real product.
