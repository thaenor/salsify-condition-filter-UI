import type { Property } from '../domain/types';
import { PropertySelect } from './PropertySelect';

interface FilterBarProps {
    properties: Property[];
    selectedProperty: Property | undefined;
    onSelectProperty: (id: number) => void;
}

export function FilterBar({ properties, selectedProperty, onSelectProperty }: FilterBarProps) {
    return (
        <div className="bg-card border rounded-lg p-4 flex gap-4 items-end">
            <PropertySelect
                properties={properties}
                selectedPropertyId={selectedProperty?.id}
                onSelectProperty={onSelectProperty}
            />
        </div>
    );
}
