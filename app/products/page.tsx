"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AddProduct } from "@/components/AddProduct";

interface Product {
  nome: string;
  kcal: number;
  carboidrati: number;
  proteine: number;
  grassi: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/products.json");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-5">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Caricamento prodotti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-5">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-600">Errore: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Prodotti</h1>

        <div className="flex gap-4 items-center">
          <AddProduct />

          <Button asChild>
            <Link href="/">Torna alla home</Link>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cerca prodotti..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent outline-none"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            {filteredProducts.length} prodotto
            {filteredProducts.length !== 1 ? "i" : ""} trovato
            {filteredProducts.length !== 1 ? "i" : ""}
            {searchTerm && ` per "${searchTerm}"`}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-600">
              {searchTerm
                ? `Nessun prodotto trovato per "${searchTerm}"`
                : "Nessun prodotto trovato"}
            </p>
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {product.nome}
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calorie:</span>
                  <span className="font-medium">{product.kcal} kcal</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Carboidrati:</span>
                  <span className="font-medium">{product.carboidrati}g</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Proteine:</span>
                  <span className="font-medium">{product.proteine}g</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Grassi:</span>
                  <span className="font-medium">{product.grassi}g</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
