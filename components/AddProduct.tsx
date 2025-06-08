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
import { useRef } from "react";

export function AddProduct() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = {
      nome: formData.get("name")?.toString() || "",
      kcal: parseFloat(formData.get("kcal")?.toString() || "0") || 0,
      carboidrati:
        parseFloat(formData.get("carboidrati")?.toString() || "0") || 0,
      proteine: parseFloat(formData.get("proteine")?.toString() || "0") || 0,
      grassi: parseFloat(formData.get("grassi")?.toString() || "0") || 0,
    };

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const result = await res.json();
    } catch (err) {
      console.error("Errore nella chiamata API:", err);
    } finally {
      event.target.reset();
      closeRef.current?.click();
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Aggiungi Prodotto</Button>
      </DialogTrigger>
      <DialogContent className="text-neutral-900">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crea Prodotto</DialogTitle>
            <DialogDescription>Metti valori per 100 grammi.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-8">
            <div className="grid gap-3 col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" placeholder="Pasta" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="kcal">Kcal</Label>
              <Input
                id="kcal"
                name="kcal"
                type="number"
                placeholder="es. 250"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="carboidrati">Carboidrati</Label>
              <Input
                id="carboidrati"
                name="carboidrati"
                type="number"
                placeholder="es. 30"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="proteine">Proteine</Label>
              <Input
                id="proteine"
                name="proteine"
                type="number"
                placeholder="es. 20"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="grassi">Grassi</Label>
              <Input
                id="grassi"
                name="grassi"
                type="number"
                placeholder="es. 10"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={closeRef}>
                Indietro
              </Button>
            </DialogClose>
            <Button type="submit">Crea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
