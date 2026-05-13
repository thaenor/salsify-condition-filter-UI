import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';
import InfoIcon from './ui/InfoIcon';

interface MultiInputProps {
    onCommit: (value: string) => void;
    placeholder: string;
}

export function MultiInput({ onCommit, placeholder }: MultiInputProps) {
    const [raw, setRaw] = useState('');

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
                <label className="text-sm font-medium" htmlFor="multi-input">
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
                id="multi-input"
                type="text"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                onBlur={() => onCommit(raw)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') onCommit(raw);
                }}
                placeholder={placeholder}
                className="border border-input rounded-md px-3 py-2 bg-background text-sm min-w-44"
            />
        </div>
    );
}
