interface ClearButtonProps {
    onClear: () => void;
}

export function ClearButton({ onClear }: ClearButtonProps) {
    return (
        <button
            type="button"
            onClick={onClear}
            className="border border-input rounded-md px-3 py-2 bg-background text-sm hover:bg-accent cursor-pointer"
        >
            Clear
        </button>
    );
}
