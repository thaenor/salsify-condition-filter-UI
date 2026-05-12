import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { PageTitle } from './components/PageTitle';
import { FilterBar } from './components/FilterBar';
import { ProductTable } from './components/ProductTable';
import { useFilterController } from './application/useFilterController';

export default function App() {
    const controller = useFilterController();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <NavBar />
            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
                <PageTitle />
                <FilterBar
                    properties={controller.properties}
                    selectedProperty={controller.selectedProperty}
                    onSelectProperty={controller.selectProperty}
                />
                <ProductTable
                    properties={controller.properties}
                    products={controller.filteredProducts}
                />
            </main>
            <Footer />
        </div>
    );
}
