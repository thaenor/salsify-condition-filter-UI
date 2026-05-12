import { useState } from 'react';

interface TextInputProps {
    onCommit: (value: string) => void;
}

// Raw input state lives here, not in the controller.
// If a clear/reset button is added later, key this component on draft.stage
// to let React unmount/remount and reset local state naturally.
export function TextInput({ onCommit }: TextInputProps) {
    const [raw, setRaw] = useState('');

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="value-input">
                Value
            </label>
            <input
                id="value-input"
                type="text"
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
