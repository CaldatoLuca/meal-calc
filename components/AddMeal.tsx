"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Product {
  nome: string;
  kcal: number;
  carboidrati: number;
  proteine: number;
  grassi: number;
}

interface MealProduct {
  id: string;
  productName: string;
  grams: number;
}

export function AddMeal() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [mealProducts, setMealProducts] = useState<MealProduct[]>([
    { id: "1", productName: "", grams: 0 },
  ]);
  const [mealName, setMealName] = useState("");
  const [totalMacros, setTotalMacros] = useState({
    kcal: 0,
    carboidrati: 0,
    proteine: 0,
    grassi: 0,
  });

  // Load products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/products.json");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Calculate total macros whenever meal products change
  useEffect(() => {
    const totals = mealProducts.reduce(
      (acc, mealProduct) => {
        const product = products.find(
          (p) => p.nome === mealProduct.productName
        );
        if (product && mealProduct.grams > 0) {
          const multiplier = mealProduct.grams / 100; // Convert from 100g base to actual grams
          acc.kcal += product.kcal * multiplier;
          acc.carboidrati += product.carboidrati * multiplier;
          acc.proteine += product.proteine * multiplier;
          acc.grassi += product.grassi * multiplier;
        }
        return acc;
      },
      { kcal: 0, carboidrati: 0, proteine: 0, grassi: 0 }
    );

    setTotalMacros({
      kcal: Math.round(totals.kcal * 10) / 10,
      carboidrati: Math.round(totals.carboidrati * 10) / 10,
      proteine: Math.round(totals.proteine * 10) / 10,
      grassi: Math.round(totals.grassi * 10) / 10,
    });
  }, [mealProducts, products]);

  const addProductRow = () => {
    const newId = (
      Math.max(...mealProducts.map((p) => parseInt(p.id))) + 1
    ).toString();
    setMealProducts([
      ...mealProducts,
      { id: newId, productName: "", grams: 0 },
    ]);
  };

  const removeProductRow = (id: string) => {
    if (mealProducts.length > 1) {
      setMealProducts(mealProducts.filter((p) => p.id !== id));
    }
  };

  const updateMealProduct = (
    id: string,
    field: "productName" | "grams",
    value: string | number
  ) => {
    setMealProducts(
      mealProducts.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const mealData = {
      nome: mealName,
      kcal: totalMacros.kcal,
      carboidrati: totalMacros.carboidrati,
      proteine: totalMacros.proteine,
      grassi: totalMacros.grassi,
      ingredients: mealProducts.filter((p) => p.productName && p.grams > 0),
    };

    try {
      const res = await fetch("/api/save-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      const result = await res.json();
      console.log("Meal saved:", result);
    } catch (err) {
      console.error("Errore nella chiamata API:", err);
    } finally {
      // Reset form
      setMealName("");
      setMealProducts([{ id: "1", productName: "", grams: 0 }]);
      closeRef.current?.click();
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Aggiungi Pasto</Button>
      </DialogTrigger>
      <DialogContent className="text-neutral-900 max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crea Pasto</DialogTitle>
            <DialogDescription>
              Aggiungi prodotti e quantità per creare un pasto completo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-6">
            {/* Meal Name */}
            <div className="grid gap-3">
              <Label htmlFor="mealName">Nome Pasto</Label>
              <Input
                id="mealName"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="es. Pasta al pomodoro"
                required
              />
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Ingredienti</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProductRow}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi
                </Button>
              </div>

              {mealProducts.map((mealProduct) => (
                <div
                  key={mealProduct.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border rounded-lg"
                >
                  <div className="md:col-span-2">
                    <Label htmlFor={`product-${mealProduct.id}`}>
                      Prodotto
                    </Label>
                    <Select
                      value={mealProduct.productName}
                      onValueChange={(value: any) =>
                        updateMealProduct(mealProduct.id, "productName", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona prodotto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.nome} value={product.nome}>
                            {product.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`grams-${mealProduct.id}`}>Grammi</Label>
                      <Input
                        id={`grams-${mealProduct.id}`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={mealProduct.grams || ""}
                        onChange={(e) =>
                          updateMealProduct(
                            mealProduct.id,
                            "grams",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="100"
                      />
                    </div>

                    {mealProducts.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeProductRow(mealProduct.id)}
                        className="mt-6"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Macros Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-base font-semibold mb-3 block">
                Totali Nutrizionali
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg text-orange-600">
                    {totalMacros.kcal}
                  </div>
                  <div className="text-gray-600">Kcal</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-blue-600">
                    {totalMacros.carboidrati}g
                  </div>
                  <div className="text-gray-600">Carboidrati</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-green-600">
                    {totalMacros.proteine}g
                  </div>
                  <div className="text-gray-600">Proteine</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-yellow-600">
                    {totalMacros.grassi}g
                  </div>
                  <div className="text-gray-600">Grassi</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={closeRef}>
                Annulla
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                !mealName ||
                mealProducts.every((p) => !p.productName || p.grams <= 0)
              }
            >
              Crea Pasto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
