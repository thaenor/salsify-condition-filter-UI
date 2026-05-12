import type { Property, Product } from '../domain/types';

type Props = {
    properties: Property[];
    products: Product[];
};

export function ProductTable({ properties, products }: Props) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                    <tr>
                        {properties.map((p) => (
                            <th key={p.id} className="text-left px-4 py-3 font-medium">
                                {p.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={properties.length}
                                className="text-center text-muted-foreground px-4 py-10"
                            >
                                No products to display.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="border-t">
                                {properties.map((prop) => {
                                    const pv = product.propertyValues.find(
                                        (v) => v.propertyId === prop.id
                                    );
                                    return (
                                        <td key={prop.id} className="px-4 py-3">
                                            {pv !== undefined ? String(pv.value) : '—'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
