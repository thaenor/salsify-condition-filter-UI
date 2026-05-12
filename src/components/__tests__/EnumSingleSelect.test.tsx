// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnumSingleSelect } from '../EnumSingleSelect';

describe('EnumSingleSelect', () => {
    const options = ['tools', 'electronics', 'kitchenware'];

    it('renders all options from the list', () => {
        render(<EnumSingleSelect options={options} onCommit={vi.fn()} />);
        const allOptions = screen.getAllByRole('option');
        expect(allOptions).toHaveLength(4); // placeholder + 3 options
        expect(allOptions[1]).toHaveTextContent('tools');
        expect(allOptions[2]).toHaveTextContent('electronics');
        expect(allOptions[3]).toHaveTextContent('kitchenware');
    });

    it('shows placeholder when nothing is selected', () => {
        render(<EnumSingleSelect options={options} onCommit={vi.fn()} />);
        const placeholder = screen.getByRole('option', { name: /Select a value/i });
        expect(placeholder).toBeInTheDocument();
    });

    it('calls onCommit immediately on selection', () => {
        const handleCommit = vi.fn();
        render(<EnumSingleSelect options={options} onCommit={handleCommit} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'electronics' } });
        expect(handleCommit).toHaveBeenCalledWith('electronics');
        expect(handleCommit).toHaveBeenCalledTimes(1);
    });

    it('renders nothing when options list is empty', () => {
        const { container } = render(<EnumSingleSelect options={[]} onCommit={vi.fn()} />);
        expect(container.firstChild).toBeNull();
    });
});
