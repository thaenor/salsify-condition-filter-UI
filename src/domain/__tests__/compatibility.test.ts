import { describe, it, expect } from 'vitest';
import { COMPATIBILITY } from '../compatibility';

describe('COMPATIBILITY', () => {
  it('should have entries for all property types', () => {
    expect(COMPATIBILITY).toHaveProperty('string');
    expect(COMPATIBILITY).toHaveProperty('number');
    expect(COMPATIBILITY).toHaveProperty('enumerated');
  });

  it('should allow equals for all property types', () => {
    expect(COMPATIBILITY.string).toContain('equals');
    expect(COMPATIBILITY.number).toContain('equals');
    expect(COMPATIBILITY.enumerated).toContain('equals');
  });

  it('should allow any and none for all property types', () => {
    expect(COMPATIBILITY.string).toContain('any');
    expect(COMPATIBILITY.string).toContain('none');
    expect(COMPATIBILITY.number).toContain('any');
    expect(COMPATIBILITY.number).toContain('none');
    expect(COMPATIBILITY.enumerated).toContain('any');
    expect(COMPATIBILITY.enumerated).toContain('none');
  });

  it('should allow in for all property types', () => {
    expect(COMPATIBILITY.string).toContain('in');
    expect(COMPATIBILITY.number).toContain('in');
    expect(COMPATIBILITY.enumerated).toContain('in');
  });

  it('should allow contains only for string', () => {
    expect(COMPATIBILITY.string).toContain('contains');
    expect(COMPATIBILITY.number).not.toContain('contains');
    expect(COMPATIBILITY.enumerated).not.toContain('contains');
  });

  it('should allow greater_than and less_than only for number', () => {
    expect(COMPATIBILITY.number).toContain('greater_than');
    expect(COMPATIBILITY.number).toContain('less_than');
    expect(COMPATIBILITY.string).not.toContain('greater_than');
    expect(COMPATIBILITY.string).not.toContain('less_than');
    expect(COMPATIBILITY.enumerated).not.toContain('greater_than');
    expect(COMPATIBILITY.enumerated).not.toContain('less_than');
  });

  it('should only contain valid operator ids', () => {
    const validIds = new Set(['equals', 'greater_than', 'less_than', 'any', 'none', 'in', 'contains']);
    for (const propType of Object.values(COMPATIBILITY)) {
      for (const opId of propType) {
        expect(validIds.has(opId)).toBe(true);
      }
    }
  });
});
