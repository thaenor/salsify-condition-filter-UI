// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ValueInput } from '../ValueInput';

describe('ValueInput', () => {
    it('renders TextInput when inputKind is text', () => {
        render(<ValueInput inputKind="text" onCommit={vi.fn()} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders nothing when inputKind is none', () => {
        const { container } = render(<ValueInput inputKind="none" onCommit={vi.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    it.todo('renders NumberInput when inputKind is number');
    it.todo('renders MultiTextInput when inputKind is multi-text');
    it.todo('renders MultiNumberInput when inputKind is multi-number');
    it.todo('renders EnumSingleInput when inputKind is enum-single');
    it.todo('renders EnumMultiInput when inputKind is enum-multi');
});
