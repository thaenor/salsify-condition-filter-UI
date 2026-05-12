import type { Product, FilterDraft, FilterCriteria } from './types';

/**
 * Type guard that checks if a filter draft has been fully configured.
 * A draft is ready when it has a property, operator, and validated value.
 * @param draft - The filter draft to check
 * @returns true if the draft is in 'ready' stage, false otherwise
 */
export function isReady(draft: FilterDraft): draft is Extract<FilterDraft, { stage: 'ready' }> {
  return draft.stage === 'ready';
}

/**
 * Converts a ready filter draft into FilterCriteria ready for application.
 * Throws an error if the draft is not fully configured.
 * @param draft - The filter draft to convert
 * @returns FilterCriteria with kind 'single' containing the property, operator, and value
 * @throws Error if the draft is not in 'ready' stage
 */
export function toCriteria(draft: FilterDraft): FilterCriteria {
    //TODO: design decision should throw here?
    if (!isReady(draft)) {
        throw new Error("Draft is not ready");
    }
    return {
        kind: "single",
        propertyId: draft.propertyId,
        operatorId: draft.operatorId,
        value: draft.value,
    };
}

/**
 * Applies a filter criteria to a list of products, returning only matching products.
 * Supports operators: equals, contains, greater_than, less_than, any, none, in.
 * String comparisons are case-insensitive; number and enum comparisons are strict.
 * @param products - The list of products to filter
 * @param criteria - The filter criteria to apply
 * @returns A new array containing only products matching the criteria
 */
export function applyFilter(products: Product[], criteria: FilterCriteria): Product[] {
  if (criteria.kind === 'none') {
    return products;
  }

  return products.filter((product) => {
    const propertyValue = product.propertyValues.find((pv) => pv.propertyId === criteria.propertyId);
    const operatorId = criteria.operatorId;

    if (operatorId === 'any') {
      return propertyValue !== undefined;
    }

    if (operatorId === 'none') {
      return propertyValue === undefined;
    }

    if (propertyValue === undefined) {
      return false;
    }

    const value = propertyValue.value;

    if (operatorId === 'equals') {
      const criteriaValue = criteria.value;
      if (criteriaValue.kind === 'text') {
        return String(value).toLowerCase() === criteriaValue.value.toLowerCase();
      } else if (criteriaValue.kind === 'number') {
        return value === criteriaValue.value;
      } else if (criteriaValue.kind === 'enum-single') {
        return value === criteriaValue.value;
      }
    }

    if (operatorId === 'contains') {
      const criteriaValue = criteria.value;
      if (criteriaValue.kind === 'text') {
        return String(value).toLowerCase().includes(criteriaValue.value.toLowerCase());
      }
    }

    if (operatorId === 'greater_than') {
      const criteriaValue = criteria.value;
      if (criteriaValue.kind === 'number' && typeof value === 'number') {
        return value > criteriaValue.value;
      }
    }

    if (operatorId === 'less_than') {
      const criteriaValue = criteria.value;
      if (criteriaValue.kind === 'number' && typeof value === 'number') {
        return value < criteriaValue.value;
      }
    }

    if (operatorId === 'in') {
      const criteriaValue = criteria.value;
      if (criteriaValue.kind === 'multi-text') {
        return criteriaValue.values.some(
          (v) => String(value).toLowerCase() === v.toLowerCase()
        );
      } else if (criteriaValue.kind === 'multi-number') {
        return criteriaValue.values.includes(value as number);
      } else if (criteriaValue.kind === 'enum-multi') {
        return criteriaValue.values.includes(value as string);
      }
    }

    return false;
  });
}
