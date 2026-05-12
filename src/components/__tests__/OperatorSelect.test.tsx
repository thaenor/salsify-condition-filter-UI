// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Operator } from '../../domain/types';
import { OperatorSelect } from '../OperatorSelect';

describe('OperatorSelect', () => {
    const mockOperators: Operator[] = [
        { id: 'equals', text: 'Equals' },
        { id: 'contains', text: 'Contains' },
        { id: 'greater_than', text: 'Greater Than' },
    ];

    it('renders all operator options from the list', () => {
        const mockOnSelect = vi.fn();
        render(
            <OperatorSelect
                operators={mockOperators}
                selectedOperatorId={undefined}
                onSelectOperator={mockOnSelect}
            />
        );

        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(4); // placeholder + 3 operators
        expect(options[1]).toHaveTextContent('Equals');
        expect(options[2]).toHaveTextContent('Contains');
        expect(options[3]).toHaveTextContent('Greater Than');
    });

    it('shows placeholder "Select an operator…" when no operator is selected', () => {
        const mockOnSelect = vi.fn();
        render(
            <OperatorSelect
                operators={mockOperators}
                selectedOperatorId={undefined}
                onSelectOperator={mockOnSelect}
            />
        );

        const placeholder = screen.getByRole('option', { name: /Select an operator/i });
        expect(placeholder).toBeInTheDocument();
    });

    it('calls onSelectOperator with the operator id when user selects an option', () => {
        const mockOnSelect = vi.fn();
        render(
            <OperatorSelect
                operators={mockOperators}
                selectedOperatorId={undefined}
                onSelectOperator={mockOnSelect}
            />
        );

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: 'contains' } });

        expect(mockOnSelect).toHaveBeenCalledWith('contains');
        expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it('renders nothing (returns null) when operators list is empty', () => {
        const mockOnSelect = vi.fn();
        const { container } = render(
            <OperatorSelect
                operators={[]}
                selectedOperatorId={undefined}
                onSelectOperator={mockOnSelect}
            />
        );

        expect(container.firstChild).toBeNull();
    });
});
