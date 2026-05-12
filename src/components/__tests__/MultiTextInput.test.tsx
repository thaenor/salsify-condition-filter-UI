// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiTextInput } from '../MultiTextInput';

describe('MultiTextInput', () => {
    it('renders a text input', () => {
        render(<MultiTextInput onCommit={vi.fn()} />);
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
    });

    it('tracks typed value locally', () => {
        render(<MultiTextInput onCommit={vi.fn()} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Headphones, Keys' } });
        expect(input).toHaveValue('Headphones, Keys');
    });

    it('calls onCommit with current value on blur', () => {
        const handleCommit = vi.fn();
        render(<MultiTextInput onCommit={handleCommit} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'a, b, c' } });
        fireEvent.blur(input);
        expect(handleCommit).toHaveBeenCalledWith('a, b, c');
    });

    it('calls onCommit with current value on Enter', () => {
        const handleCommit = vi.fn();
        render(<MultiTextInput onCommit={handleCommit} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'x, y' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(handleCommit).toHaveBeenCalledWith('x, y');
    });

    it('shows a comma hint placeholder', () => {
        render(<MultiTextInput onCommit={vi.fn()} />);
        const input = screen.getByPlaceholderText('e.g. Headphones, Keys');
        expect(input).toBeInTheDocument();
    });

    it('renders an info icon for tooltip hint', () => {
        render(<MultiTextInput onCommit={vi.fn()} />);
        const label = screen.getByText('Values');
        expect(label.closest('div')?.querySelector('svg')).toBeInTheDocument();
    });
});
