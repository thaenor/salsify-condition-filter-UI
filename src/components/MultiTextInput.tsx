import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

interface MultiTextInputProps {
    onCommit: (value: string) => void;
}

function InfoIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}

export function MultiTextInput({ onCommit }: MultiTextInputProps) {
    const [raw, setRaw] = useState('');

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
                <label className="text-sm font-medium" htmlFor="multi-text-input">
                    Values
                </label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <InfoIcon />
                        </TooltipTrigger>
                        <TooltipContent>Separate values with commas</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <input
                id="multi-text-input"
                type="text"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                onBlur={() => onCommit(raw)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onCommit(raw);
                }}
                placeholder="e.g. Headphones, Keys"
                className="border border-input rounded-md px-3 py-2 bg-background text-sm min-w-44"
            />
        </div>
    );
}
