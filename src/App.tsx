import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { PageTitle } from './components/PageTitle'
import { FilterBar } from './components/FilterBar'
import { ProductTable } from './components/ProductTable'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        <PageTitle />
        <FilterBar />
        <ProductTable />
      </main>
      <Footer />
    </div>
  )
}
