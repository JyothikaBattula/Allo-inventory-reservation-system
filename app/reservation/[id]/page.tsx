"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReservationPage() {
  const params = useParams<{ id: string }>();
  const reservationId = params.id;

  const [reservation, setReservation] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    fetch("/api/reservations/list")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (r: any) => r.id === reservationId
        );

        setReservation(found);
      });
  }, [reservationId]);

  useEffect(() => {
    if (!reservation) return;

    const timer = setInterval(() => {
      const expiry =
        new Date(reservation.createdAt).getTime() +
        15 * 60 * 1000;

      const now = Date.now();

      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const minutes = Math.floor(
        diff / 1000 / 60
      );

      const seconds = Math.floor(
        (diff / 1000) % 60
      );

      setTimeLeft(
        `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation]);

  async function confirmReservation() {
    const response = await fetch(
      "/api/reservations/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert("Reservation Confirmed Successfully");
    window.location.href = "/";
  }

  async function cancelReservation() {
    const response = await fetch(
       "/api/reservations/release",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }
    alert("Reservation Cancelled");
    window.location.href = "/";
  }

  if (!reservation) {
    return (
      <div className="p-8">
        Loading reservation...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-4xl font-bold mb-6">
          Checkout Reservation
        </h1>

        <div className="space-y-4">
          <p>
            <strong>Status:</strong>{" "}
            {reservation.status}
          </p>

          <p>
            <strong>Product:</strong>{" "}
            {reservation.product}
          </p>

          <p>
            <strong>Warehouse:</strong>{" "}
            {reservation.warehouse}
          </p>

          <p>
            <strong>Quantity:</strong>{" "}
            {reservation.quantity}
          </p>

          <p className="text-red-600 font-bold text-lg">
            Time Remaining: {timeLeft}
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={confirmReservation}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Confirm Purchase
          </button>

          <button
            onClick={cancelReservation}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Cancel Reservation
          </button>
        </div>
      </div>
    </main>
  );
}