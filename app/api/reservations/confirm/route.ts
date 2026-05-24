import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { reservationId } = await request.json();

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (reservation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Reservation already processed" },
        { status: 400 }
      );
    }

    if (reservation.expiresAt < new Date()) {
  const inventory = await prisma.inventory.findFirst({
    where: {
      productId: reservation.productId,
      warehouseId: reservation.warehouseId,
    },
  });

  if (inventory) {
    await prisma.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        reservedStock:
          inventory.reservedStock -
          reservation.quantity,
      },
    });
  }

  await prisma.reservation.update({
    where: {
      id: reservation.id,
    },
    data: {
      status: "RELEASED",
    },
  });

  return NextResponse.json(
    { error: "Reservation expired" },
    { status: 410 }
  );
}

    const inventory = await prisma.inventory.findFirst({
      where: {
        productId: reservation.productId,
        warehouseId: reservation.warehouseId,
      },
    });

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    await prisma.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        totalStock: inventory.totalStock - reservation.quantity,
        reservedStock:
          inventory.reservedStock - reservation.quantity,
      },
    });

    const updatedReservation =
      await prisma.reservation.update({
        where: {
          id: reservationId,
        },
        data: {
          status: "CONFIRMED",
        },
      });

    return NextResponse.json({
      success: true,
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Confirmation failed" },
      { status: 500 }
    );
  }
}