import { useRef } from 'react';
import type { Property, Operator, OperatorId, ValueInputKind } from '../domain/types';
import { PropertySelect } from './PropertySelect';
import { OperatorSelect } from './OperatorSelect';
import { ValueInput } from './ValueInput';
import { ClearButton } from './ClearButton';

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
    onClear: () => void;
    showClear: boolean;
    parseError: string | null;
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
    onClear,
    showClear,
    parseError,
}: FilterBarProps) {
    const propertySelectRef = useRef<HTMLSelectElement>(null);

    const handleClear = () => {
        onClear();
        propertySelectRef.current?.focus();
    };

    return (
        <div
            className="bg-card border rounded-lg p-4 flex gap-4 items-end"
            role="search"
            aria-label="Product filter"
        >
            <PropertySelect
                properties={properties}
                selectedPropertyId={selectedProperty?.id}
                onSelectProperty={onSelectProperty}
                selectRef={propertySelectRef}
            />
            {selectedProperty && (
                <OperatorSelect
                    operators={operators}
                    selectedOperatorId={selectedOperatorId}
                    onSelectOperator={onSelectOperator}
                />
            )}
            {inputKind && inputKind !== 'none' && (
                <>
                    {/* key forces remount when operator changes, resetting local input state */}
                    <ValueInput
                        key={selectedOperatorId}
                        inputKind={inputKind}
                        onCommit={onCommitValue}
                        options={enumOptions}
                    />
                </>
            )}
            {parseError && (
                <span role="alert" className="text-destructive text-sm self-center">
                    {parseError}
                </span>
            )}
            {showClear && <ClearButton onClear={handleClear} />}
        </div>
    );
}
