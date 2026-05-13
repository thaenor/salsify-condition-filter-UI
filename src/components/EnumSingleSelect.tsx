interface EnumSingleSelectProps {
    options: string[];
    onCommit: (value: string) => void;
}

export function EnumSingleSelect({ options, onCommit }: EnumSingleSelectProps) {
    if (options.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="value-input">
                Value
            </label>
            <select
                id="value-input"
                defaultValue=""
                onChange={(e) => onCommit(e.target.value)}
                className="border border-input rounded-md px-3 py-2 bg-background text-sm min-w-44 cursor-pointer"
            >
                <option value="" disabled>
                    Select a value…
                </option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}
