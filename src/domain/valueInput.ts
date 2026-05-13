import type { Property, Operator, ValueInputKind, CriteriaValue, ParseResult } from './types';

// This map could be derived programmatically from COMPATIBILITY (which operators are valid
// per property type) combined with a per-operator shape rule (single vs multi vs none).
// We chose an explicit static map because it's self-documenting and the operators/types
// are not expected to change. Only valid property-type + operator combos are listed.
const VALUE_INPUT_MAP: Record<string, Record<string, ValueInputKind>> = {
    string: {
        equals: 'text',
        contains: 'text',
        any: 'none',
        none: 'none',
        in: 'multi-text',
    },
    number: {
        equals: 'number',
        greater_than: 'number',
        less_than: 'number',
        any: 'none',
        none: 'none',
        in: 'multi-number',
    },
    enumerated: {
        equals: 'enum-single',
        any: 'none',
        none: 'none',
        in: 'enum-multi',
    },
};

export function valueInputKindFor(property: Property, operator: Operator): ValueInputKind {
    return VALUE_INPUT_MAP[property.type][operator.id];
}

function splitTokens(raw: string): string[] {
    return raw
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');
}

function parseFiniteNumber(s: string): ParseResult<number> {
    const trimmed = s.trim();
    if (trimmed === '' || !Number.isFinite(Number(trimmed))) {
        return { ok: false, error: 'Please enter a valid number' };
    }
    const num = Number(trimmed);
    return { ok: true, value: num };
}

export function parseRawValue(
    property: Property,
    operator: Operator,
    raw: string
): ParseResult<CriteriaValue> {
    const kind = valueInputKindFor(property, operator);

    switch (kind) {
        case 'none':
            return { ok: true, value: { kind: 'none' } };

        case 'text': {
            const trimmed = raw.trim();
            if (trimmed === '') {
                return { ok: false, error: 'Value cannot be empty' };
            }
            return { ok: true, value: { kind: 'text', value: trimmed } };
        }

        case 'number': {
            const result = parseFiniteNumber(raw);
            if (!result.ok) return result;
            return { ok: true, value: { kind: 'number', value: result.value } };
        }

        case 'multi-text': {
            const tokens = splitTokens(raw);
            if (tokens.length === 0) {
                return { ok: false, error: 'At least one value is required' };
            }
            return { ok: true, value: { kind: 'multi-text', values: tokens } };
        }

        case 'multi-number': {
            const tokens = splitTokens(raw);
            if (tokens.length === 0) {
                return { ok: false, error: 'At least one value is required' };
            }
            const numbers: number[] = [];
            for (const token of tokens) {
                const result = parseFiniteNumber(token);
                if (!result.ok) return result;
                numbers.push(result.value);
            }
            return { ok: true, value: { kind: 'multi-number', values: numbers } };
        }

        case 'enum-single': {
            const trimmed = raw.trim();
            if (trimmed === '') {
                return { ok: false, error: 'Value cannot be empty' };
            }
            if (!property.values!.includes(trimmed)) {
                return { ok: false, error: `Invalid value: ${trimmed}` };
            }
            return { ok: true, value: { kind: 'enum-single', value: trimmed } };
        }

        case 'enum-multi': {
            const tokens = splitTokens(raw);
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
    }
}
