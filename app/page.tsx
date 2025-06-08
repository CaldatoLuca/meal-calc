"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Clock, Users } from "lucide-react";
import { AddMeal } from "@/components/AddMeal";

interface Ingredient {
  id: string;
  productName: string;
  grams: number;
}

interface Meal {
  id: string;
  nome: string;
  kcal: number;
  carboidrati: number;
  proteine: number;
  grassi: number;
  ingredients: Ingredient[];
  createdAt: string;
}

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    try {
      const response = await fetch("/meals.json");
      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }
      const data = await response.json();
      setMeals(data);
      setFilteredMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Filter meals based on search term
  useEffect(() => {
    const filtered = meals.filter(
      (meal) =>
        meal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.ingredients.some((ingredient) =>
          ingredient.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
    );
    setFilteredMeals(filtered);
  }, [searchTerm, meals]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const refreshMeals = () => {
    fetchMeals();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-5">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Caricamento pasti...</p>
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
        <h1 className="text-2xl font-semibold">Pasti</h1>
        <div className="flex gap-3">
          <AddMeal />
          <Button asChild>
            <Link href="/products">Vedi prodotti</Link>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cerca pasti o ingredienti..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            {filteredMeals.length} pasto{filteredMeals.length !== 1 ? "i" : ""}{" "}
            trovato{filteredMeals.length !== 1 ? "i" : ""}
            {searchTerm && ` per "${searchTerm}"`}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMeals.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-600">
              {searchTerm
                ? `Nessun pasto trovato per "${searchTerm}"`
                : "Nessun pasto trovato"}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                Inizia creando il tuo primo pasto!
              </p>
            )}
          </div>
        ) : (
          filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold capitalize text-neutral-800">
                  {meal.nome}
                </h2>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(meal.createdAt)}
                </div>
              </div>

              {/* Macros Summary */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="text-center bg-orange-50 p-2 rounded-lg">
                  <div className="font-semibold text-lg text-orange-600">
                    {meal.kcal}
                  </div>
                  <div className="text-gray-600">Kcal</div>
                </div>
                <div className="text-center bg-blue-50 p-2 rounded-lg">
                  <div className="font-semibold text-lg text-blue-600">
                    {meal.carboidrati}g
                  </div>
                  <div className="text-gray-600">Carbo</div>
                </div>
                <div className="text-center bg-green-50 p-2 rounded-lg">
                  <div className="font-semibold text-lg text-green-600">
                    {meal.proteine}g
                  </div>
                  <div className="text-gray-600">Proteine</div>
                </div>
                <div className="text-center bg-yellow-50 p-2 rounded-lg">
                  <div className="font-semibold text-lg text-yellow-600">
                    {meal.grassi}g
                  </div>
                  <div className="text-gray-600">Grassi</div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="border-t pt-4">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Ingredienti:
                  </span>
                </div>
                <div className="space-y-1">
                  {meal.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span className="capitalize">
                        {ingredient.productName}
                      </span>
                      <span>{ingredient.grams}g</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
