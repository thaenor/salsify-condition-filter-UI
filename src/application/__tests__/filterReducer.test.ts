import { describe, it, expect } from 'vitest';
import { filterReducer, initialState } from '../filterReducer';
import type { Property, Operator } from '../../domain/types';

const STRING_PROPERTY: Property = { id: 0, name: 'name', type: 'string' };
const EQUALS_OPERATOR: Operator = { id: 'equals', text: 'Equals' };

describe('initialState', () => {
    it('has needs-property draft and null parseError', () => {
        expect(initialState).toEqual({ draft: { stage: 'needs-property' }, parseError: null });
    });
});

describe('selectProperty', () => {
    it('transitions from needs-property to needs-operator', () => {
        const next = filterReducer(initialState, { type: 'selectProperty', propertyId: 0 });
        expect(next.draft).toEqual({ stage: 'needs-operator', propertyId: 0 });
        expect(next.parseError).toBeNull();
    });

    it('resets to needs-operator and clears parseError when already ready', () => {
        const ready = filterReducer(
            filterReducer(filterReducer(initialState, { type: 'selectProperty', propertyId: 0 }), {
                type: 'selectOperator',
                operatorId: 'equals',
            }),
            { type: 'setValue', raw: 'Apple', property: STRING_PROPERTY, operator: EQUALS_OPERATOR }
        );
        const next = filterReducer(ready, { type: 'selectProperty', propertyId: 1 });
        expect(next.draft).toEqual({ stage: 'needs-operator', propertyId: 1 });
        expect(next.parseError).toBeNull();
    });
});

describe('selectOperator', () => {
    it('transitions needs-operator to needs-value for value-taking operator', () => {
        const afterProperty = filterReducer(initialState, {
            type: 'selectProperty',
            propertyId: 0,
        });
        const next = filterReducer(afterProperty, { type: 'selectOperator', operatorId: 'equals' });
        expect(next.draft).toEqual({ stage: 'needs-value', propertyId: 0, operatorId: 'equals' });
    });

    it('transitions directly to ready for "any"', () => {
        const afterProperty = filterReducer(initialState, {
            type: 'selectProperty',
            propertyId: 0,
        });
        const next = filterReducer(afterProperty, { type: 'selectOperator', operatorId: 'any' });
        expect(next.draft).toEqual({
            stage: 'ready',
            propertyId: 0,
            operatorId: 'any',
            value: { kind: 'none' },
        });
    });

    it('transitions directly to ready for "none"', () => {
        const afterProperty = filterReducer(initialState, {
            type: 'selectProperty',
            propertyId: 0,
        });
        const next = filterReducer(afterProperty, { type: 'selectOperator', operatorId: 'none' });
        expect(next.draft).toEqual({
            stage: 'ready',
            propertyId: 0,
            operatorId: 'none',
            value: { kind: 'none' },
        });
    });

    it('is a no-op when draft is needs-property', () => {
        const next = filterReducer(initialState, { type: 'selectOperator', operatorId: 'equals' });
        expect(next).toBe(initialState);
    });

    it('resets to needs-value and clears parseError when already ready', () => {
        const ready = filterReducer(
            filterReducer(filterReducer(initialState, { type: 'selectProperty', propertyId: 0 }), {
                type: 'selectOperator',
                operatorId: 'equals',
            }),
            { type: 'setValue', raw: 'Apple', property: STRING_PROPERTY, operator: EQUALS_OPERATOR }
        );
        const next = filterReducer(ready, { type: 'selectOperator', operatorId: 'contains' });
        expect(next.draft).toEqual({ stage: 'needs-value', propertyId: 0, operatorId: 'contains' });
        expect(next.parseError).toBeNull();
    });
});

describe('setValue', () => {
    it('transitions needs-value to ready on success', () => {
        const afterOperator = filterReducer(
            filterReducer(initialState, { type: 'selectProperty', propertyId: 0 }),
            { type: 'selectOperator', operatorId: 'equals' }
        );
        const next = filterReducer(afterOperator, {
            type: 'setValue',
            raw: 'Apple',
            property: STRING_PROPERTY,
            operator: EQUALS_OPERATOR,
        });
        expect(next.draft).toEqual({
            stage: 'ready',
            propertyId: 0,
            operatorId: 'equals',
            value: { kind: 'text', value: 'Apple' },
        });
        expect(next.parseError).toBeNull();
    });

    it('stays at needs-value and sets parseError on failure', () => {
        const afterOperator = filterReducer(
            filterReducer(initialState, { type: 'selectProperty', propertyId: 0 }),
            { type: 'selectOperator', operatorId: 'equals' }
        );
        const next = filterReducer(afterOperator, {
            type: 'setValue',
            raw: '   ',
            property: STRING_PROPERTY,
            operator: EQUALS_OPERATOR,
        });
        expect(next.draft).toEqual({ stage: 'needs-value', propertyId: 0, operatorId: 'equals' });
        expect(next.parseError).toBeTypeOf('string');
        expect(next.parseError!.length).toBeGreaterThan(0);
    });

    it('updates value when already ready', () => {
        const ready = filterReducer(
            filterReducer(filterReducer(initialState, { type: 'selectProperty', propertyId: 0 }), {
                type: 'selectOperator',
                operatorId: 'equals',
            }),
            { type: 'setValue', raw: 'Apple', property: STRING_PROPERTY, operator: EQUALS_OPERATOR }
        );
        const next = filterReducer(ready, {
            type: 'setValue',
            raw: 'Banana',
            property: STRING_PROPERTY,
            operator: EQUALS_OPERATOR,
        });
        expect(next.draft).toEqual({
            stage: 'ready',
            propertyId: 0,
            operatorId: 'equals',
            value: { kind: 'text', value: 'Banana' },
        });
        expect(next.parseError).toBeNull();
    });

    it('is a no-op when draft is needs-property', () => {
        const next = filterReducer(initialState, {
            type: 'setValue',
            raw: 'x',
            property: STRING_PROPERTY,
            operator: EQUALS_OPERATOR,
        });
        expect(next).toBe(initialState);
    });

    it('is a no-op when draft is needs-operator', () => {
        const afterProperty = filterReducer(initialState, {
            type: 'selectProperty',
            propertyId: 0,
        });
        const next = filterReducer(afterProperty, {
            type: 'setValue',
            raw: 'x',
            property: STRING_PROPERTY,
            operator: EQUALS_OPERATOR,
        });
        expect(next).toBe(afterProperty);
    });
});

describe('clear', () => {
    it('resets to initialState from any stage', () => {
        const ready = filterReducer(
            filterReducer(filterReducer(initialState, { type: 'selectProperty', propertyId: 0 }), {
                type: 'selectOperator',
                operatorId: 'equals',
            }),
            { type: 'setValue', raw: 'Apple', property: STRING_PROPERTY, operator: EQUALS_OPERATOR }
        );
        expect(filterReducer(ready, { type: 'clear' })).toEqual(initialState);
    });

    it('is idempotent from initial state', () => {
        expect(filterReducer(initialState, { type: 'clear' })).toEqual(initialState);
    });
});
