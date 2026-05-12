// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnumMultiSelect } from '../EnumMultiSelect';

describe('EnumMultiSelect', () => {
    const options = ['tools', 'electronics', 'kitchenware'];

    it('renders a checkbox for each option', () => {
        render(<EnumMultiSelect options={options} onCommit={vi.fn()} />);
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(3);
    });

    it('renders labels for each option', () => {
        render(<EnumMultiSelect options={options} onCommit={vi.fn()} />);
        expect(screen.getByLabelText('tools')).toBeInTheDocument();
        expect(screen.getByLabelText('electronics')).toBeInTheDocument();
        expect(screen.getByLabelText('kitchenware')).toBeInTheDocument();
    });

    it('calls onCommit with checked value on first toggle', () => {
        const handleCommit = vi.fn();
        render(<EnumMultiSelect options={options} onCommit={handleCommit} />);
        fireEvent.click(screen.getByLabelText('electronics'));
        expect(handleCommit).toHaveBeenCalledWith('electronics');
    });

    it('calls onCommit with comma-separated values when multiple checked', () => {
        const handleCommit = vi.fn();
        render(<EnumMultiSelect options={options} onCommit={handleCommit} />);
        fireEvent.click(screen.getByLabelText('electronics'));
        fireEvent.click(screen.getByLabelText('tools'));
        expect(handleCommit).toHaveBeenLastCalledWith('electronics, tools');
    });

    it('removes value from commit string when unchecked', () => {
        const handleCommit = vi.fn();
        render(<EnumMultiSelect options={options} onCommit={handleCommit} />);
        fireEvent.click(screen.getByLabelText('electronics'));
        fireEvent.click(screen.getByLabelText('tools'));
        fireEvent.click(screen.getByLabelText('electronics'));
        expect(handleCommit).toHaveBeenLastCalledWith('tools');
    });

    it('renders nothing when options list is empty', () => {
        const { container } = render(<EnumMultiSelect options={[]} onCommit={vi.fn()} />);
        expect(container.firstChild).toBeNull();
    });
});
