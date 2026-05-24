import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inventory = await prisma.inventory.findMany({
    include: {
      product: true,
      warehouse: true,
    },
  });

  const result = inventory.map((item) => ({
    id: item.id,
    product: item.product.name,
    warehouse: item.warehouse.name,
    totalStock: item.totalStock,
    reservedStock: item.reservedStock,
    availableStock:
      item.totalStock - item.reservedStock,
  }));

  return NextResponse.json(result);
}