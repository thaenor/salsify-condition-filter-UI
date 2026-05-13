// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '../NumberInput';

describe('NumberInput', () => {
    it('renders an empty number input', () => {
        render(<NumberInput onCommit={vi.fn()} />);
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveValue(null);
    });

    it('tracks typed value locally', () => {
        render(<NumberInput onCommit={vi.fn()} />);
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '42' } });
        expect(input).toHaveValue(42);
    });

    it('calls onCommit with current value as string on blur', () => {
        const handleCommit = vi.fn();
        render(<NumberInput onCommit={handleCommit} />);
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '3.14' } });
        fireEvent.blur(input);
        expect(handleCommit).toHaveBeenCalledWith('3.14');
    });

    it('calls onCommit with current value as string on Enter', () => {
        const handleCommit = vi.fn();
        render(<NumberInput onCommit={handleCommit} />);
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '99' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(handleCommit).toHaveBeenCalledWith('99');
    });
});
