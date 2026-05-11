export type PropertyType = 'string' | 'number' | 'enumerated';

export type OperatorId = 'equals' | 'greater_than' | 'less_than' | 'any' | 'none' | 'in' | 'contains';

export type ValueInputKind = 'none' | 'text' | 'number' | 'multi-text' | 'multi-number' | 'enum-single' | 'enum-multi';

export type CriteriaValue =
  | { kind: 'none' }
  | { kind: 'text'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'multi-text'; values: string[] }
  | { kind: 'multi-number'; values: number[] }
  | { kind: 'enum-single'; value: string }
  | { kind: 'enum-multi'; values: string[] };

export type FilterDraft =
  | { stage: 'needs-property' }
  | { stage: 'needs-operator'; propertyId: number }
  | { stage: 'needs-value'; propertyId: number; operatorId: OperatorId }
  | { stage: 'ready'; propertyId: number; operatorId: OperatorId; value: CriteriaValue };

export type FilterCriteria =
  | { kind: 'none' }
  | { kind: 'single'; propertyId: number; operatorId: OperatorId; value: CriteriaValue };

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export interface PropertyValue {
  propertyId: number;
  value: string | number;
}

export interface Product {
  id: number;
  propertyValues: PropertyValue[];
}

export interface Property {
  id: number;
  name: string;
  type: PropertyType;
  values?: string[];
}

export interface Operator {
  id: OperatorId;
  text: string;
}
