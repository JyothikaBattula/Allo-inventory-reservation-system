"use client";

import { useRouter } from "next/navigation";

export default function ReserveButton({
  productId,
}: {
  productId: number;
}) {
  const router = useRouter();

  async function reserveProduct() {
    try {
      const response = await fetch(
        "/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            productId,
            warehouseId: 1,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to reserve stock"
        );
        return;
      }

      router.push(
        `/reservation/${data.reservation.id}`
      );
    } catch {
      alert("Something went wrong");
    }
  }

  return (
    <button
      onClick={reserveProduct}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Reserve
    </button>
  );
}