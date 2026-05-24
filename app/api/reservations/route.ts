import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      productId,
      warehouseId,
      quantity
    } = body;

    const reservation = await prisma.$transaction(
      async (tx) => {
        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId,
              warehouseId,
            },
          });

        if (!inventory) {
          throw new Error(
            "INVENTORY_NOT_FOUND"
          );
        }

        const availableStock =
          inventory.totalStock -
          inventory.reservedStock;

        if (
          availableStock < quantity
        ) {
          throw new Error(
            "OUT_OF_STOCK"
          );
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            reservedStock:
              inventory.reservedStock +
              quantity,
          },
        });

        return await tx.reservation.create({
          data: {
            productId,
            warehouseId,
            quantity,
            expiresAt: new Date(
              Date.now() +
                15 * 60 * 1000
            ),
          },
        });
      }
    );

    return NextResponse.json({
      success: true,
      reservation,
    });

  } catch (error) {
    console.error(error);

    if (
      error instanceof Error
    ) {
      if (
        error.message ===
        "INVENTORY_NOT_FOUND"
      ) {
        return NextResponse.json(
          {
            error:
              "Inventory not found",
          },
          {
            status: 404,
          }
        );
      }

      if (
        error.message ===
        "OUT_OF_STOCK"
      ) {
        return NextResponse.json(
          {
            error:
              "Not enough stock available",
          },
          {
            status: 409,
          }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Reservation failed",
      },
      {
        status: 500,
      }
    );
  }
}