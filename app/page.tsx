import { Button } from "@/components/ui/button";
import { AddProduct } from "@/components/ui/AddProduct";

export default function Home() {
  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Meal Calculator</h1>
        <div className="flex gap-4 items-center">
          <AddProduct />
          <Button>Vedi Prodotti</Button>
        </div>
      </div>
    </div>
  );
}
