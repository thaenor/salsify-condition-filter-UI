import type { ValueInputKind } from '../domain/types';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { EnumSingleSelect } from './EnumSingleSelect';
import { MultiTextInput } from './MultiTextInput';

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
            return <MultiTextInput onCommit={onCommit} />;
        case 'enum-single':
            return <EnumSingleSelect options={options} onCommit={onCommit} />;
        case 'none':
            return null;
        default:
            return null;
    }
}
