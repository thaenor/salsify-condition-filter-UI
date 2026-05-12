// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiInput } from '../MultiInput';

describe('MultiInput', () => {
    it('renders a text input', () => {
        render(<MultiInput onCommit={vi.fn()} placeholder="e.g. a, b" />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with the given placeholder', () => {
        render(<MultiInput onCommit={vi.fn()} placeholder="e.g. 10, 20" />);
        expect(screen.getByPlaceholderText('e.g. 10, 20')).toBeInTheDocument();
    });

    it('tracks typed value locally', () => {
        render(<MultiInput onCommit={vi.fn()} placeholder="e.g. a, b" />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Headphones, Keys' } });
        expect(input).toHaveValue('Headphones, Keys');
    });

    it('calls onCommit with current value on blur', () => {
        const handleCommit = vi.fn();
        render(<MultiInput onCommit={handleCommit} placeholder="e.g. a, b" />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'a, b, c' } });
        fireEvent.blur(input);
        expect(handleCommit).toHaveBeenCalledWith('a, b, c');
    });

    it('calls onCommit with current value on Enter', () => {
        const handleCommit = vi.fn();
        render(<MultiInput onCommit={handleCommit} placeholder="e.g. a, b" />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'x, y' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(handleCommit).toHaveBeenCalledWith('x, y');
    });

    it('renders an info icon for tooltip hint', () => {
        render(<MultiInput onCommit={vi.fn()} placeholder="e.g. a, b" />);
        const label = screen.getByText('Values');
        expect(label.closest('div')?.querySelector('svg')).toBeInTheDocument();
    });
});
