import type { Operator, OperatorId } from '../domain/types';

interface OperatorSelectProps {
    operators: Operator[];
    selectedOperatorId: OperatorId | undefined;
    onSelectOperator: (id: OperatorId) => void;
}

export function OperatorSelect({
    operators,
    selectedOperatorId,
    onSelectOperator,
}: OperatorSelectProps) {
    if (operators.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="operator-select">
                Operator
            </label>
            <select
                id="operator-select"
                value={selectedOperatorId ?? ''}
                onChange={(e) => onSelectOperator(e.target.value as OperatorId)}
                className="border border-input rounded-md px-3 py-2 bg-background text-sm min-w-44 cursor-pointer"
            >
                <option value="" disabled>
                    Select an operator…
                </option>
                {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                        {op.text}
                    </option>
                ))}
            </select>
        </div>
    );
}
