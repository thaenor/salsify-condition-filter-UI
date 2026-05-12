import { useState } from 'react';

interface NumberInputProps {
    onCommit: (value: string) => void;
}

export function NumberInput({ onCommit }: NumberInputProps) {
    const [raw, setRaw] = useState('');

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="value-input">
                Value
            </label>
            <input
                id="value-input"
                type="number"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                onBlur={() => onCommit(raw)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onCommit(raw);
                }}
                className="border border-input rounded-md px-3 py-2 bg-background text-sm min-w-44"
            />
        </div>
    );
}
