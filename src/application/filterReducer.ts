import type { FilterDraft, OperatorId, Property, Operator } from '../domain/types';
import { parseRawValue } from '../domain/valueInput';

export type ControllerState = {
    draft: FilterDraft;
    parseError: string | null;
};

export type Action =
    | { type: 'selectProperty'; propertyId: number }
    | { type: 'selectOperator'; operatorId: OperatorId }
    | { type: 'setValue'; raw: string; property: Property; operator: Operator }
    | { type: 'clear' };

export const initialState: ControllerState = {
    draft: { stage: 'needs-property' },
    parseError: null,
};

export function filterReducer(state: ControllerState, action: Action): ControllerState {
    switch (action.type) {
        case 'selectProperty':
            return {
                draft: { stage: 'needs-operator', propertyId: action.propertyId },
                parseError: null,
            };

        case 'selectOperator': {
            if (state.draft.stage === 'needs-property') return state;
            const { propertyId } = state.draft;
            if (action.operatorId === 'any' || action.operatorId === 'none') {
                return {
                    draft: {
                        stage: 'ready',
                        propertyId,
                        operatorId: action.operatorId,
                        value: { kind: 'none' },
                    },
                    parseError: null,
                };
            }
            return {
                draft: { stage: 'needs-value', propertyId, operatorId: action.operatorId },
                parseError: null,
            };
        }

        case 'setValue': {
            const { draft } = state;
            if (draft.stage !== 'needs-value' && draft.stage !== 'ready') return state;
            const { propertyId, operatorId } = draft;
            const result = parseRawValue(action.property, action.operator, action.raw);
            if (!result.ok) {
                return {
                    draft: { stage: 'needs-value', propertyId, operatorId },
                    parseError: result.error,
                };
            }
            return {
                draft: { stage: 'ready', propertyId, operatorId, value: result.value },
                parseError: null,
            };
        }

        case 'clear':
            return initialState;
    }
}
