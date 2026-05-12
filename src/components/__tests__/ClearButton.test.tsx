// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClearButton } from '../ClearButton';

describe('ClearButton', () => {
    it('renders a button with text "Clear"', () => {
        render(<ClearButton onClear={vi.fn()} />);
        expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('calls onClear when clicked', () => {
        const handleClear = vi.fn();
        render(<ClearButton onClear={handleClear} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClear).toHaveBeenCalledTimes(1);
    });
});
