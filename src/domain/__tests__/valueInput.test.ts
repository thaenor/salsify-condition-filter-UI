import { describe, it, expect } from 'vitest';
import type { Property, Operator, ValueInputKind, CriteriaValue } from '../types';
import { valueInputKindFor, parseRawValue } from '../valueInput';

describe('valueInputKindFor', () => {
  const stringProp: Property = { id: 1, name: 'Name', type: 'string' };
  const numberProp: Property = { id: 2, name: 'Price', type: 'number' };
  const enumProp: Property = { id: 3, name: 'Status', type: 'enumerated', values: ['Active', 'Inactive'] };

  const operators: Record<string, Operator> = {
    equals: { id: 'equals', text: 'Equals' },
    greater_than: { id: 'greater_than', text: 'Is greater than' },
    less_than: { id: 'less_than', text: 'Is less than' },
    any: { id: 'any', text: 'Has any value' },
    none: { id: 'none', text: 'Has no value' },
    in: { id: 'in', text: 'Is any of' },
    contains: { id: 'contains', text: 'Contains' },
  };

  describe('string property', () => {
    it('equals → text', () => {
      expect(valueInputKindFor(stringProp, operators.equals)).toBe('text');
    });

    it('contains → text', () => {
      expect(valueInputKindFor(stringProp, operators.contains)).toBe('text');
    });

    it('any → none', () => {
      expect(valueInputKindFor(stringProp, operators.any)).toBe('none');
    });

    it('none → none', () => {
      expect(valueInputKindFor(stringProp, operators.none)).toBe('none');
    });

    it('in → multi-text', () => {
      expect(valueInputKindFor(stringProp, operators.in)).toBe('multi-text');
    });
  });

  describe('number property', () => {
    it('equals → number', () => {
      expect(valueInputKindFor(numberProp, operators.equals)).toBe('number');
    });

    it('greater_than → number', () => {
      expect(valueInputKindFor(numberProp, operators.greater_than)).toBe('number');
    });

    it('less_than → number', () => {
      expect(valueInputKindFor(numberProp, operators.less_than)).toBe('number');
    });

    it('any → none', () => {
      expect(valueInputKindFor(numberProp, operators.any)).toBe('none');
    });

    it('none → none', () => {
      expect(valueInputKindFor(numberProp, operators.none)).toBe('none');
    });

    it('in → multi-number', () => {
      expect(valueInputKindFor(numberProp, operators.in)).toBe('multi-number');
    });
  });

  describe('enumerated property', () => {
    it('equals → enum-single', () => {
      expect(valueInputKindFor(enumProp, operators.equals)).toBe('enum-single');
    });

    it('any → none', () => {
      expect(valueInputKindFor(enumProp, operators.any)).toBe('none');
    });

    it('none → none', () => {
      expect(valueInputKindFor(enumProp, operators.none)).toBe('none');
    });

    it('in → enum-multi', () => {
      expect(valueInputKindFor(enumProp, operators.in)).toBe('enum-multi');
    });
  });
});

describe('parseRawValue', () => {
  const stringProp: Property = { id: 1, name: 'Name', type: 'string' };
  const numberProp: Property = { id: 2, name: 'Price', type: 'number' };
  const enumProp: Property = { id: 3, name: 'Status', type: 'enumerated', values: ['Active', 'Inactive', 'Pending'] };

  const operators: Record<string, Operator> = {
    equals: { id: 'equals', text: 'Equals' },
    greater_than: { id: 'greater_than', text: 'Is greater than' },
    less_than: { id: 'less_than', text: 'Is less than' },
    any: { id: 'any', text: 'Has any value' },
    none: { id: 'none', text: 'Has no value' },
    in: { id: 'in', text: 'Is any of' },
    contains: { id: 'contains', text: 'Contains' },
  };

  describe('any and none operators', () => {
    it('any → { kind: "none" }', () => {
      const result = parseRawValue(stringProp, operators.any, '');
      expect(result).toEqual({ ok: true, value: { kind: 'none' } });
    });

    it('none → { kind: "none" }', () => {
      const result = parseRawValue(numberProp, operators.none, '');
      expect(result).toEqual({ ok: true, value: { kind: 'none' } });
    });
  });

  describe('text input (string equals/contains)', () => {
    it('string equals valid input', () => {
      const result = parseRawValue(stringProp, operators.equals, 'Headphones');
      expect(result).toEqual({ ok: true, value: { kind: 'text', value: 'Headphones' } });
    });

    it('string contains valid input', () => {
      const result = parseRawValue(stringProp, operators.contains, 'phone');
      expect(result).toEqual({ ok: true, value: { kind: 'text', value: 'phone' } });
    });

    it('trims whitespace', () => {
      const result = parseRawValue(stringProp, operators.equals, '  Headphones  ');
      expect(result).toEqual({ ok: true, value: { kind: 'text', value: 'Headphones' } });
    });

    it('rejects empty input', () => {
      const result = parseRawValue(stringProp, operators.equals, '');
      expect(result.ok).toBe(false);
      expect(result.ok === false && result.error).toBeTruthy();
    });

    it('rejects whitespace-only input', () => {
      const result = parseRawValue(stringProp, operators.equals, '   ');
      expect(result.ok).toBe(false);
    });
  });

  describe('number input (number equals/greater_than/less_than)', () => {
    it('parses valid integer', () => {
      const result = parseRawValue(numberProp, operators.equals, '42');
      expect(result).toEqual({ ok: true, value: { kind: 'number', value: 42 } });
    });

    it('parses valid float', () => {
      const result = parseRawValue(numberProp, operators.equals, '3.14');
      expect(result).toEqual({ ok: true, value: { kind: 'number', value: 3.14 } });
    });

    it('parses negative number', () => {
      const result = parseRawValue(numberProp, operators.equals, '-5');
      expect(result).toEqual({ ok: true, value: { kind: 'number', value: -5 } });
    });

    it('parses scientific notation', () => {
      const result = parseRawValue(numberProp, operators.equals, '1e2');
      expect(result).toEqual({ ok: true, value: { kind: 'number', value: 100 } });
    });

    it('trims whitespace', () => {
      const result = parseRawValue(numberProp, operators.greater_than, '  20  ');
      expect(result).toEqual({ ok: true, value: { kind: 'number', value: 20 } });
    });

    it('rejects empty input', () => {
      const result = parseRawValue(numberProp, operators.equals, '');
      expect(result.ok).toBe(false);
    });

    it('rejects NaN', () => {
      const result = parseRawValue(numberProp, operators.equals, 'abc');
      expect(result.ok).toBe(false);
    });

    it('rejects Infinity', () => {
      const result = parseRawValue(numberProp, operators.equals, 'Infinity');
      expect(result.ok).toBe(false);
    });

    it('rejects -Infinity', () => {
      const result = parseRawValue(numberProp, operators.equals, '-Infinity');
      expect(result.ok).toBe(false);
    });
  });

  describe('multi-text input (string in)', () => {
    it('parses single value', () => {
      const result = parseRawValue(stringProp, operators.in, 'Headphones');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-text', values: ['Headphones'] } });
    });

    it('parses comma-separated values', () => {
      const result = parseRawValue(stringProp, operators.in, 'Headphones, Keys');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-text', values: ['Headphones', 'Keys'] } });
    });

    it('trims whitespace around tokens', () => {
      const result = parseRawValue(stringProp, operators.in, '  Headphones  ,  Keys  ');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-text', values: ['Headphones', 'Keys'] } });
    });

    it('drops empty tokens', () => {
      const result = parseRawValue(stringProp, operators.in, 'Headphones,,Keys');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-text', values: ['Headphones', 'Keys'] } });
    });

    it('handles trailing comma', () => {
      const result = parseRawValue(stringProp, operators.in, 'Headphones, Keys,');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-text', values: ['Headphones', 'Keys'] } });
    });

    it('rejects all-empty input', () => {
      const result = parseRawValue(stringProp, operators.in, '');
      expect(result.ok).toBe(false);
    });

    it('rejects whitespace-only input', () => {
      const result = parseRawValue(stringProp, operators.in, '   ,  ,   ');
      expect(result.ok).toBe(false);
    });
  });

  describe('multi-number input (number in)', () => {
    it('parses single number', () => {
      const result = parseRawValue(numberProp, operators.in, '42');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-number', values: [42] } });
    });

    it('parses comma-separated numbers', () => {
      const result = parseRawValue(numberProp, operators.in, '10, 20, 30');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-number', values: [10, 20, 30] } });
    });

    it('trims whitespace around tokens', () => {
      const result = parseRawValue(numberProp, operators.in, '  10  ,  20  ');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-number', values: [10, 20] } });
    });

    it('parses mixed int and float', () => {
      const result = parseRawValue(numberProp, operators.in, '10, 3.14, 20');
      expect(result).toEqual({ ok: true, value: { kind: 'multi-number', values: [10, 3.14, 20] } });
    });

    it('rejects empty input', () => {
      const result = parseRawValue(numberProp, operators.in, '');
      expect(result.ok).toBe(false);
    });

    it('rejects if any token is invalid', () => {
      const result = parseRawValue(numberProp, operators.in, '10, abc, 20');
      expect(result.ok).toBe(false);
    });

    it('rejects if any token is Infinity', () => {
      const result = parseRawValue(numberProp, operators.in, '10, Infinity, 20');
      expect(result.ok).toBe(false);
    });
  });

  describe('enum-single input (enumerated equals)', () => {
    it('accepts valid enum value', () => {
      const result = parseRawValue(enumProp, operators.equals, 'Active');
      expect(result).toEqual({ ok: true, value: { kind: 'enum-single', value: 'Active' } });
    });

    it('rejects value not in enum', () => {
      const result = parseRawValue(enumProp, operators.equals, 'Invalid');
      expect(result.ok).toBe(false);
    });

    it('rejects empty input', () => {
      const result = parseRawValue(enumProp, operators.equals, '');
      expect(result.ok).toBe(false);
    });
  });

  describe('enum-multi input (enumerated in)', () => {
    it('parses single valid value', () => {
      const result = parseRawValue(enumProp, operators.in, 'Active');
      expect(result).toEqual({ ok: true, value: { kind: 'enum-multi', values: ['Active'] } });
    });

    it('parses multiple valid values', () => {
      const result = parseRawValue(enumProp, operators.in, 'Active, Inactive');
      expect(result).toEqual({ ok: true, value: { kind: 'enum-multi', values: ['Active', 'Inactive'] } });
    });

    it('trims whitespace around tokens', () => {
      const result = parseRawValue(enumProp, operators.in, '  Active  ,  Pending  ');
      expect(result).toEqual({ ok: true, value: { kind: 'enum-multi', values: ['Active', 'Pending'] } });
    });

    it('rejects if any value not in enum', () => {
      const result = parseRawValue(enumProp, operators.in, 'Active, Invalid');
      expect(result.ok).toBe(false);
    });

    it('rejects empty input', () => {
      const result = parseRawValue(enumProp, operators.in, '');
      expect(result.ok).toBe(false);
    });
  });
});
