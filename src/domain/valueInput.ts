import type { Property, Operator, ValueInputKind, CriteriaValue, ParseResult } from './types';

export function valueInputKindFor(property: Property, operator: Operator): ValueInputKind {
  if (operator.id === 'any' || operator.id === 'none') {
    return 'none';
  }

  if (operator.id === 'in') {
    if (property.type === 'string') {
      return 'multi-text';
    } else if (property.type === 'number') {
      return 'multi-number';
    } else {
      return 'enum-multi';
    }
  }

  if (property.type === 'string') {
    return 'text';
  } else if (property.type === 'number') {
    return 'number';
  } else {
    return 'enum-single';
  }
}

export function parseRawValue(
  property: Property,
  operator: Operator,
  raw: string
): ParseResult<CriteriaValue> {
  const kind = valueInputKindFor(property, operator);

  if (kind === 'none') {
    return { ok: true, value: { kind: 'none' } };
  }

  if (kind === 'text') {
    const trimmed = raw.trim();
    if (trimmed === '') {
      return { ok: false, error: 'Value cannot be empty' };
    }
    return { ok: true, value: { kind: 'text', value: trimmed } };
  }

  if (kind === 'number') {
    const trimmed = raw.trim();
    if (trimmed === '') {
      return { ok: false, error: 'Value cannot be empty' };
    }
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      return { ok: false, error: 'Value must be a finite number' };
    }
    return { ok: true, value: { kind: 'number', value: num } };
  }

  if (kind === 'multi-text') {
    const tokens = raw
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
    if (tokens.length === 0) {
      return { ok: false, error: 'At least one value is required' };
    }
    return { ok: true, value: { kind: 'multi-text', values: tokens } };
  }

  if (kind === 'multi-number') {
    const tokens = raw
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
    if (tokens.length === 0) {
      return { ok: false, error: 'At least one value is required' };
    }
    const numbers: number[] = [];
    for (const token of tokens) {
      const num = Number(token);
      if (!Number.isFinite(num)) {
        return { ok: false, error: `Invalid number: ${token}` };
      }
      numbers.push(num);
    }
    return { ok: true, value: { kind: 'multi-number', values: numbers } };
  }

  if (kind === 'enum-single') {
    const trimmed = raw.trim();
    if (trimmed === '') {
      return { ok: false, error: 'Value cannot be empty' };
    }
    if (!property.values!.includes(trimmed)) {
      return { ok: false, error: `Invalid value: ${trimmed}` };
    }
    return { ok: true, value: { kind: 'enum-single', value: trimmed } };
  }

  if (kind === 'enum-multi') {
    const tokens = raw
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
    if (tokens.length === 0) {
      return { ok: false, error: 'At least one value is required' };
    }
    for (const token of tokens) {
      if (!property.values!.includes(token)) {
        return { ok: false, error: `Invalid value: ${token}` };
      }
    }
    return { ok: true, value: { kind: 'enum-multi', values: tokens } };
  }

  return { ok: false, error: 'Unknown input kind' };
}
