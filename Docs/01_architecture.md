# Architecture

The system is organized in four layers with unidirectional dependencies: UI imports from Application; Application imports from Domain and Infrastructure; Domain and Infrastructure do not import from outer layers.

```
      ui
       ↓
  application
     ↙   ↘
  data    domain
     ↘   ↙
    domain
```

## The layers

**Domain.** Pure functions with no I/O or framework dependencies. Implements the operator catalog, compatibility matrix, filter engine, and value-input-kind dispatch. All functions are total functions (valid inputs always produce defined outputs).

Public API:
- `applyFilter(products, criteria)` → `Product[]`
- `validOperatorsFor(property)` → `Operator[]`
- `valueInputKindFor(property, op)` → `ValueInputKind`
- `parseRawValue(property, op, raw)` → `ParseResult<CriteriaValue>`
- `isReady(draft)` → `boolean`
- `toCriteria(draft)` → `FilterCriteria`

**Data**. The bridge between external sources and the application's internal vocabulary. Today it holds a single static datastore; the architecture accommodates additional sources without domain changes. Each source may ship its own naming conventions (snake_case from a Python API, PascalCase from a Ruby service, attributes instead of properties). The data layer maps all of these into the domain's types and terminology. No other layer references external field names or knows that a translation occurred.


**Application.** Holds the in-progress filter draft as primary state. Exposes mutation operations: set property, set operator, set value, apply, clear. Computes available operators, value input kind, and filtered products from the draft state. Does not duplicate stored state.

**UI.** Renders components from props. Queries the application layer to determine valid operators, required input kind, and filtered products.

## Key structures

### FilterDraft state machine

The in-progress filter is a discriminated union with four states:

```
{ stage: 'needs-property' }
{ stage: 'needs-operator',  property }
{ stage: 'needs-value',     property, operator }
{ stage: 'ready',           property, operator, value }
```

The stage field determines which fields are present. Testing if the filter is applyable is `draft.stage === 'ready'`.

### Value input dispatch

The domain function `valueInputKindFor(property, operator)` returns a kind: `none`, `text`, `number`, `multi-text`, `multi-number`, `enum-single`, or `enum-multi`. The UI has a single `<ValueInput>` component that maps the kind to the corresponding subcomponent.

### Derived state

Available operators, value input kind, and filtered products are computed from the primary filter-draft state. They are not stored separately.

### Boundary validation

The infrastructure layer validates the datastore shape once. The domain layer operates on typed, validated data.

## Folder structure

```
src/
  domain/
    types.ts
    operators.ts
    compatibility.ts
    valueInput.ts
    filter.ts
    __tests__/
  infrastructure/
    datastore.ts
    __tests__/
  application/
    filterController.ts
    __tests__/
  ui/
    App.ts
    components/
      FilterBar/
        FilterBar.ts
        PropertyPicker.ts
        OperatorPicker.ts
        ClearButton.ts
        ValueInput/
          ValueInput.ts          // dispatcher on kind
          NoneInput.ts
          TextInput.ts
          NumberInput.ts
          MultiTextInput.ts
          EnumSingleSelect.ts
          EnumMultiSelect.ts
      ProductTable/
        ProductTable.ts
        EmptyState.ts
```

## Implementation details

- **State management.** A single application-layer controller holds filter state. No global state library is used.
- **Boundary mapping.** The data layer maps external field names and shapes into the domain's types. Validation is hand-rolled. No runtime-typing library is used.
- **FilterCriteria type.** Discriminated union with `kind: 'none'` and `kind: 'single'`. Extensible to compound filters via new variants without changing existing switch branches.

## Dependencies and frameworks

* Shadcn + Tailwind is "replace" our design system. I will assume design related defaults.
*