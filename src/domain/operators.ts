import type { Operator } from './types';

export const operators: Operator[] = [
  { id: 'equals', text: 'Equals' },
  { id: 'greater_than', text: 'Is greater than' },
  { id: 'less_than', text: 'Is less than' },
  { id: 'any', text: 'Has any value' },
  { id: 'none', text: 'Has no value' },
  { id: 'in', text: 'Is any of' },
  { id: 'contains', text: 'Contains' },
];
