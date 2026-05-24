import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const mumbai = await prisma.warehouse.create({
    data: {
      name: "Mumbai Warehouse",
    },
  });

  const vizag = await prisma.warehouse.create({
    data: {
      name: "Vizag Warehouse",
    },
  });

  const stiKit = await prisma.product.create({
    data: {
      name: "At-Home STI Test Kit",
    },
  });

  const wellnessKit = await prisma.product.create({
    data: {
      name: "Wellness Starter Kit",
    },
  });

  const diagnosticKit = await prisma.product.create({
    data: {
      name: "Diagnostic Collection Kit",
    },
  });

  const vitaminPack = await prisma.product.create({
    data: {
      name: "Vitamin Supplement Pack",
    },
  });

  const screeningKit = await prisma.product.create({
    data: {
      name: "Health Screening Kit",
    },
  });

  await prisma.inventory.createMany({
    data: [
      {
        productId: stiKit.id,
        warehouseId: mumbai.id,
        totalStock: 100,
      },
      {
        productId: wellnessKit.id,
        warehouseId: vizag.id,
        totalStock: 80,
      },
      {
        productId: diagnosticKit.id,
        warehouseId: mumbai.id,
        totalStock: 120,
      },
      {
        productId: vitaminPack.id,
        warehouseId: vizag.id,
        totalStock: 90,
      },
      {
        productId: screeningKit.id,
        warehouseId: mumbai.id,
        totalStock: 70,
      },
    ],
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });