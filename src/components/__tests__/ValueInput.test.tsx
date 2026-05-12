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

    it('renders MultiInput with text placeholder when inputKind is multi-text', () => {
        render(<ValueInput inputKind="multi-text" onCommit={vi.fn()} />);
        expect(screen.getByPlaceholderText('e.g. Headphones, Keys')).toBeInTheDocument();
    });

    it('renders MultiInput with number placeholder when inputKind is multi-number', () => {
        render(<ValueInput inputKind="multi-number" onCommit={vi.fn()} />);
        expect(screen.getByPlaceholderText('e.g. 10, 20, 30')).toBeInTheDocument();
    });

    it('renders EnumSingleSelect when inputKind is enum-single', () => {
        render(<ValueInput inputKind="enum-single" onCommit={vi.fn()} options={['a', 'b']} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders EnumMultiSelect when inputKind is enum-multi', () => {
        render(<ValueInput inputKind="enum-multi" onCommit={vi.fn()} options={['a', 'b']} />);
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(2);
    });
});
