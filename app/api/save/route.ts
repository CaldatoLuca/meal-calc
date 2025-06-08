import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const filePath = path.join(process.cwd(), "public", "products.json");

  let existing = [];
  try {
    const content = await fs.readFile(filePath, "utf-8");
    existing = JSON.parse(content);
  } catch {}

  existing.push(data);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
  return NextResponse.json({ success: true });
}
