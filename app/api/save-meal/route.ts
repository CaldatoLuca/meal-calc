// app/api/save-meal/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const mealData = await request.json();

    // Path to the meals JSON file
    const mealsFilePath = path.join(process.cwd(), "public", "meals.json");

    let meals = [];

    // Read existing meals if file exists
    if (fs.existsSync(mealsFilePath)) {
      const fileContent = fs.readFileSync(mealsFilePath, "utf8");
      try {
        meals = JSON.parse(fileContent);
      } catch (parseError) {
        console.error("Error parsing existing meals file:", parseError);
        meals = [];
      }
    }

    // Add timestamp and ID to the new meal
    const newMeal = {
      id: Date.now().toString(),
      ...mealData,
      createdAt: new Date().toISOString(),
    };

    // Add new meal to the array
    meals.push(newMeal);

    // Write updated meals back to file
    fs.writeFileSync(mealsFilePath, JSON.stringify(meals, null, 2));

    return NextResponse.json({
      success: true,
      message: "Pasto salvato con successo!",
      meal: newMeal,
    });
  } catch (error) {
    console.error("Error saving meal:", error);
    return NextResponse.json(
      { success: false, error: "Errore nel salvare il pasto" },
      { status: 500 }
    );
  }
}
