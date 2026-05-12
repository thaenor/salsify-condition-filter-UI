import type { ValueInputKind } from '../domain/types';
import { TextInput } from './TextInput';

interface ValueInputProps {
    inputKind: ValueInputKind;
    onCommit: (value: string) => void;
}

export function ValueInput({ inputKind, onCommit }: ValueInputProps) {
    switch (inputKind) {
        case 'text':
            return <TextInput onCommit={onCommit} />;
        case 'none':
            return null;
        default:
            return null;
    }
}
