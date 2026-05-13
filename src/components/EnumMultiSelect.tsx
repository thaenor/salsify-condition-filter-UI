import { useState } from 'react';

interface EnumMultiSelectProps {
    options: string[];
    onCommit: (value: string) => void;
}

export function EnumMultiSelect({ options, onCommit }: EnumMultiSelectProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    if (options.length === 0) {
        return null;
    }

    function toggle(option: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(option)) {
                next.delete(option);
            } else {
                next.add(option);
            }
            onCommit(Array.from(next).join(', '));
            return next;
        });
    }

    return (
        <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-medium">Values</legend>
            <div className="flex flex-col gap-1">
                {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selected.has(opt)}
                            onChange={() => toggle(opt)}
                            className="rounded border-input"
                        />
                        {opt}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
