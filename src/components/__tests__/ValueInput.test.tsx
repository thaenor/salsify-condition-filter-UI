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

    it('renders NumberInput when inputKind is number', () => {
        render(<ValueInput inputKind="number" onCommit={vi.fn()} />);
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
    it('renders MultiTextInput when inputKind is multi-text', () => {
        render(<ValueInput inputKind="multi-text" onCommit={vi.fn()} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    it.todo('renders MultiNumberInput when inputKind is multi-number');
    it('renders EnumSingleSelect when inputKind is enum-single', () => {
        render(<ValueInput inputKind="enum-single" onCommit={vi.fn()} options={['a', 'b']} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    it.todo('renders EnumMultiInput when inputKind is enum-multi');
});
