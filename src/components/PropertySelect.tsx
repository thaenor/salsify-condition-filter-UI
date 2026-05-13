import type { Property } from '../domain/types';

interface PropertySelectProps {
    properties: Property[];
    selectedPropertyId: number | undefined;
    onSelectProperty: (id: number) => void;
}

export function PropertySelect({
    properties,
    selectedPropertyId,
    onSelectProperty,
}: PropertySelectProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="property-select">
                Property
            </label>
            <select
                id="property-select"
                value={selectedPropertyId ?? ''}
                onChange={(e) => onSelectProperty(Number(e.target.value))}
                className="border border-input rounded-md px-3 py-2 bg-background text-sm min-w-44 cursor-pointer"
            >
                <option value="" disabled>
                    Select a property…
                </option>
                {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
