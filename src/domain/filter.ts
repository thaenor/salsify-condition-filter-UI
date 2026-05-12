import type { Product, FilterDraft, FilterCriteria, OperatorId, CriteriaValue } from './types';

type ReadyDraft = {
    stage: 'ready';
    propertyId: number;
    operatorId: OperatorId;
    value: CriteriaValue;
};

export function isReady(draft: FilterDraft): draft is Extract<FilterDraft, { stage: 'ready' }> {
    return draft.stage === 'ready';
}

export function toCriteria(draft: ReadyDraft): FilterCriteria {
    return {
        kind: 'single',
        propertyId: draft.propertyId,
        operatorId: draft.operatorId,
        value: draft.value,
    };
}

export function applyFilter(products: Product[], criteria: FilterCriteria): Product[] {
    if (criteria.kind === 'none') {
        return products;
    }

    return products.filter((product) => {
        const propertyValue = product.propertyValues.find(
            (pv) => pv.propertyId === criteria.propertyId
        );
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
