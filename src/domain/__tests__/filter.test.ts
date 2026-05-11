import { describe, it, expect } from 'vitest';
import type { Product, FilterDraft, FilterCriteria } from "../types";
import { applyFilter, isReady, toCriteria } from '../filter';

describe('isReady', () => {
  it('returns false for needs-property', () => {
    const draft: FilterDraft = { stage: 'needs-property' };
    expect(isReady(draft)).toBe(false);
  });

  it('returns false for needs-operator', () => {
    const draft: FilterDraft = { stage: 'needs-operator', propertyId: 1 };
    expect(isReady(draft)).toBe(false);
  });

  it('returns false for needs-value', () => {
    const draft: FilterDraft = { stage: 'needs-value', propertyId: 1, operatorId: 'equals' };
    expect(isReady(draft)).toBe(false);
  });

  it('returns true for ready', () => {
    const draft: FilterDraft = {
      stage: 'ready',
      propertyId: 1,
      operatorId: 'equals',
      value: { kind: 'text', value: 'test' },
    };
    expect(isReady(draft)).toBe(true);
  });
});

describe('toCriteria', () => {
  it('converts ready draft with value to single criteria', () => {
    const draft: FilterDraft = {
      stage: 'ready',
      propertyId: 2,
      operatorId: 'equals',
      value: { kind: 'text', value: 'Headphones' },
    };
    const criteria = toCriteria(draft);
    expect(criteria).toEqual({
      kind: 'single',
      propertyId: 2,
      operatorId: 'equals',
      value: { kind: 'text', value: 'Headphones' },
    });
  });

  it('converts ready draft with none value to single criteria', () => {
    const draft: FilterDraft = {
      stage: 'ready',
      propertyId: 1,
      operatorId: 'any',
      value: { kind: 'none' },
    };
    const criteria = toCriteria(draft);
    expect(criteria).toEqual({
      kind: 'single',
      propertyId: 1,
      operatorId: 'any',
      value: { kind: 'none' },
    });
  });

  it('throws or returns error for non-ready draft', () => {
    const draft: FilterDraft = { stage: 'needs-property' };
    expect(() => toCriteria(draft)).toThrow();
  });
});

describe('applyFilter', () => {
  const products: Product[] = [
    { id: 1, propertyValues: [{ propertyId: 1, value: 'Headphones' }] },
    { id: 2, propertyValues: [{ propertyId: 1, value: 'Keys' }] },
    { id: 3, propertyValues: [{ propertyId: 1, value: 'headphones' }] }, // case variation
    { id: 4, propertyValues: [] }, // no value for property 1
    { id: 5, propertyValues: [{ propertyId: 1, value: 'Telephone' }] },
  ];

  const priceProducts: Product[] = [
    { id: 1, propertyValues: [{ propertyId: 2, value: 10 }] },
    { id: 2, propertyValues: [{ propertyId: 2, value: 20 }] },
    { id: 3, propertyValues: [{ propertyId: 2, value: 30 }] },
    { id: 4, propertyValues: [] }, // no price
    { id: 5, propertyValues: [{ propertyId: 2, value: 25 }] },
  ];

  describe('equals operator', () => {
    it('matches exact string (case-insensitive)', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'equals',
        value: { kind: 'text', value: 'Headphones' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([products[0], products[2]]);
    });

    it('does not match partial strings', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'equals',
        value: { kind: 'text', value: 'phone' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([]);
    });

    it('returns empty for no matches', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'equals',
        value: { kind: 'text', value: 'NonExistent' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([]);
    });

    it('matches exact number', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 2,
        operatorId: 'equals',
        value: { kind: 'number', value: 20 },
      };
      const result = applyFilter(priceProducts, criteria);
      expect(result).toEqual([priceProducts[1]]);
    });
  });

  describe('contains operator', () => {
    it('matches substring (case-insensitive)', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'contains',
        value: { kind: 'text', value: 'phone' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([products[0], products[2], products[4]]);
    });

    it('returns empty for no substring match', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'contains',
        value: { kind: 'text', value: 'xyz' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([]);
    });
  });

  describe('greater_than operator', () => {
    it('matches numbers strictly greater than', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 2,
        operatorId: 'greater_than',
        value: { kind: 'number', value: 20 },
      };
      const result = applyFilter(priceProducts, criteria);
      expect(result).toEqual([priceProducts[2], priceProducts[4]]);
    });

    it('does not include equal values', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 2,
        operatorId: 'greater_than',
        value: { kind: 'number', value: 20 },
      };
      const result = applyFilter(priceProducts, criteria);
      expect(result).not.toContainEqual(priceProducts[1]);
    });
  });

  describe('less_than operator', () => {
    it('matches numbers strictly less than', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 2,
        operatorId: 'less_than',
        value: { kind: 'number', value: 20 },
      };
      const result = applyFilter(priceProducts, criteria);
      expect(result).toEqual([priceProducts[0]]);
    });

    it('does not include equal values', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 2,
        operatorId: 'less_than',
        value: { kind: 'number', value: 20 },
      };
      const result = applyFilter(priceProducts, criteria);
      expect(result).not.toContainEqual(priceProducts[1]);
    });
  });

  describe('any operator', () => {
    it('matches products with value for property', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'any',
        value: { kind: 'none' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([products[0], products[1], products[2], products[4]]);
    });

    it('excludes products without value for property', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'any',
        value: { kind: 'none' },
      };
      const result = applyFilter(products, criteria);
      expect(result).not.toContainEqual(products[3]);
    });
  });

  describe('none operator', () => {
    it('matches products without value for property', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'none',
        value: { kind: 'none' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([products[3]]);
    });

    it('excludes products with value for property', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'none',
        value: { kind: 'none' },
      };
      const result = applyFilter(products, criteria);
      expect(result.length).toBe(1);
    });
  });

  describe('in operator', () => {
    it('matches if value equals any in list (case-insensitive for strings)', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'in',
        value: { kind: 'multi-text', values: ['Headphones', 'Keys'] },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([products[0], products[1], products[2]]);
    });

    it('returns empty if no value matches', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'in',
        value: { kind: 'multi-text', values: ['NonExistent1', 'NonExistent2'] },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([]);
    });

    it('matches numbers in list', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 2,
        operatorId: 'in',
        value: { kind: 'multi-number', values: [10, 30] },
      };
      const result = applyFilter(priceProducts, criteria);
      expect(result).toEqual([priceProducts[0], priceProducts[2]]);
    });
  });

  describe('edge cases', () => {
    it('handles empty product list', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'equals',
        value: { kind: 'text', value: 'Headphones' },
      };
      const result = applyFilter([], criteria);
      expect(result).toEqual([]);
    });

    it('handles criteria for non-existent property id', () => {
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 999,
        operatorId: 'equals',
        value: { kind: 'text', value: 'test' },
      };
      const result = applyFilter(products, criteria);
      expect(result).toEqual([]);
    });

    it('maintains insertion order', () => {
      const unorderedProducts: Product[] = [
        { id: 5, propertyValues: [{ propertyId: 1, value: 'Test' }] },
        { id: 3, propertyValues: [{ propertyId: 1, value: 'Test' }] },
        { id: 1, propertyValues: [{ propertyId: 1, value: 'Test' }] },
      ];
      const criteria: FilterCriteria = {
        kind: 'single',
        propertyId: 1,
        operatorId: 'equals',
        value: { kind: 'text', value: 'Test' },
      };
      const result = applyFilter(unorderedProducts, criteria);
      expect(result).toEqual(unorderedProducts);
    });
  });

  describe('none filter (no filter applied)', () => {
    it('returns all products when criteria is kind: none', () => {
      const criteria: FilterCriteria = { kind: 'none' };
      const result = applyFilter(products, criteria);
      expect(result).toEqual(products);
    });
  });
});
