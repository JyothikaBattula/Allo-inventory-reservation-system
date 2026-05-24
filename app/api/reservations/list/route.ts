import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reservations = await prisma.reservation.findMany({
  select: {
    id: true,
    status: true,
    quantity: true,
    expiresAt: true,
    createdAt: true,
    product: true,
    warehouse: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});

  const result = reservations.map(
    (reservation) => ({
      id: reservation.id,
      status: reservation.status,
      quantity: reservation.quantity,
      product: reservation.product.name,
      warehouse: reservation.warehouse.name,
      expiresAt: reservation.expiresAt,
      createdAt: reservation.createdAt,
    })
  );

  return NextResponse.json(result);
}