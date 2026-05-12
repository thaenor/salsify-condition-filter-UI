import type { Property, Operator, OperatorId, ValueInputKind } from '../domain/types';
import { PropertySelect } from './PropertySelect';
import { OperatorSelect } from './OperatorSelect';
import { ValueInput } from './ValueInput';

interface FilterBarProps {
    properties: Property[];
    selectedProperty: Property | undefined;
    onSelectProperty: (id: number) => void;
    operators: Operator[];
    selectedOperatorId: OperatorId | undefined;
    onSelectOperator: (id: OperatorId) => void;
    inputKind: ValueInputKind | null;
    onCommitValue: (value: string) => void;
    enumOptions: string[];
}

export function FilterBar({
    properties,
    selectedProperty,
    onSelectProperty,
    operators,
    selectedOperatorId,
    onSelectOperator,
    inputKind,
    onCommitValue,
    enumOptions,
}: FilterBarProps) {
    return (
        <div className="bg-card border rounded-lg p-4 flex gap-4 items-end">
            <PropertySelect
                properties={properties}
                selectedPropertyId={selectedProperty?.id}
                onSelectProperty={onSelectProperty}
            />
            {selectedProperty && (
                <OperatorSelect
                    operators={operators}
                    selectedOperatorId={selectedOperatorId}
                    onSelectOperator={onSelectOperator}
                />
            )}
            {inputKind && inputKind !== 'none' && (
                <ValueInput inputKind={inputKind} onCommit={onCommitValue} options={enumOptions} />
            )}
        </div>
    );
}
