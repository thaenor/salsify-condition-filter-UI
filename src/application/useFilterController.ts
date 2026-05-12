import { useReducer } from 'react';
import type { OperatorId } from '../domain/types';
import { COMPATIBILITY } from '../domain/compatibility';
import { operators } from '../domain/operators';
import { applyFilter, isReady, toCriteria } from '../domain/filter';
import { valueInputKindFor } from '../domain/valueInput';
import datastore from '../infrastructure/datastore';
import { filterReducer, initialState } from './filterReducer';

export function useFilterController(ds = datastore) {
    const [state, dispatch] = useReducer(filterReducer, initialState);
    const products = ds.getProducts();
    const properties = ds.getProperties();

    const { draft, parseError } = state;

    const selectedProperty =
        draft.stage !== 'needs-property'
            ? properties.find((p) => p.id === draft.propertyId)
            : undefined;

    const validOperators = selectedProperty
        ? operators.filter((op) => COMPATIBILITY[selectedProperty.type].includes(op.id))
        : [];

    const selectedOperator =
        draft.stage === 'needs-value' || draft.stage === 'ready'
            ? operators.find((op) => op.id === draft.operatorId)
            : undefined;

    const inputKind =
        selectedProperty && selectedOperator
            ? valueInputKindFor(selectedProperty, selectedOperator)
            : null;

    const filteredProducts = isReady(draft) ? applyFilter(products, toCriteria(draft)) : products;

    function selectProperty(propertyId: number) {
        dispatch({ type: 'selectProperty', propertyId });
    }

    function selectOperator(operatorId: OperatorId) {
        dispatch({ type: 'selectOperator', operatorId });
    }

    function setValue(raw: string) {
        if (!selectedProperty || !selectedOperator) return;
        dispatch({
            type: 'setValue',
            raw,
            property: selectedProperty,
            operator: selectedOperator,
        });
    }

    function clear() {
        dispatch({ type: 'clear' });
    }

    return {
        properties,
        filteredProducts,
        draft,
        parseError,
        selectedProperty,
        selectedOperator,
        validOperators,
        inputKind,
        selectProperty,
        selectOperator,
        setValue,
        clear,
    };
}
