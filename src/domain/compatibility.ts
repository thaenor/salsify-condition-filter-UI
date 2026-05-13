import type { PropertyType, OperatorId } from './types';

export const COMPATIBILITY: Record<PropertyType, OperatorId[]> = {
    string: ['equals', 'any', 'none', 'in', 'contains'],
    number: ['equals', 'greater_than', 'less_than', 'any', 'none', 'in'],
    enumerated: ['equals', 'any', 'none', 'in'],
};
