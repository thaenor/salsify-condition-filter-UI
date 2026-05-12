// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from '../TextInput';

describe('TextInput', () => {
    it('renders an empty text input', () => {
        render(<TextInput onCommit={vi.fn()} />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
    });

    it('tracks typed value locally', () => {
        render(<TextInput onCommit={vi.fn()} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'hello' } });
        expect(input).toHaveValue('hello');
    });

    it('calls onCommit with current value on blur', () => {
        const handleCommit = vi.fn();
        render(<TextInput onCommit={handleCommit} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'world' } });
        fireEvent.blur(input);
        expect(handleCommit).toHaveBeenCalledWith('world');
    });

    it('calls onCommit with current value on Enter', () => {
        const handleCommit = vi.fn();
        render(<TextInput onCommit={handleCommit} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(handleCommit).toHaveBeenCalledWith('test');
    });

    it.todo('handles empty string as valid input');
});
