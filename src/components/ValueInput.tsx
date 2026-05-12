import type { ValueInputKind } from '../domain/types';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { MultiInput } from './MultiInput';
import { EnumSingleSelect } from './EnumSingleSelect';
import { EnumMultiSelect } from './EnumMultiSelect';

interface ValueInputProps {
    inputKind: ValueInputKind;
    onCommit: (value: string) => void;
    options?: string[];
}

export function ValueInput({ inputKind, onCommit, options = [] }: ValueInputProps) {
    switch (inputKind) {
        case 'text':
            return <TextInput onCommit={onCommit} />;
        case 'number':
            return <NumberInput onCommit={onCommit} />;
        case 'multi-text':
            return <MultiInput onCommit={onCommit} placeholder="e.g. Headphones, Keys" />;
        case 'multi-number':
            return <MultiInput onCommit={onCommit} placeholder="e.g. 10, 20, 30" />;
        case 'enum-single':
            return <EnumSingleSelect options={options} onCommit={onCommit} />;
        case 'enum-multi':
            return <EnumMultiSelect options={options} onCommit={onCommit} />;
        case 'none':
            return null;
    }
}
