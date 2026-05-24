import ReserveButton from "./components/ReserveButton";

 const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
export default async function Home() {
  const products = await fetch(
  `${baseUrl}/api/products`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

 const warehouses = await fetch(
  `${baseUrl}/api/warehouses`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  const reservations = await fetch(
  `${baseUrl}/api/reservations/list`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  const inventory = await fetch(
  `${baseUrl}/api/inventory`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg mb-8">
          <h1 className="text-4xl font-bold">
            ALLO Inventory Dashboard
          </h1>

          <p className="text-slate-300 mt-2">
             Inventory Reservation Management System
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold">
             📦 Products
            </h2>

            <p className="text-3xl font-bold mt-2">
              {products.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold">
              🏢 Warehouses
            </h2>

            <p className="text-3xl font-bold mt-2">
              {warehouses.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold">
              📋 Reservations
            </h2>

            <p className="text-3xl font-bold mt-2">
              {reservations.length}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-4">
              📦 Products
            </h2>

            <div className="space-y-4">
             {products.map((product: any) => (
               <div
                key={product.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                 <h3 className="font-semibold">
                   {product.name}
                 </h3>

                 <p className="text-sm text-gray-500">
                    Product ID: {product.id}
                 </p>

                 {inventory
                  .filter(
                   (item: any) =>
                     item.product === product.name
                 )
                 .map((item: any) => (
                   <div key={item.id}>
                     <p className="text-sm text-slate-500">
                       Warehouse: {item.warehouse}
                     </p>

                     <p className="text-sm font-semibold text-green-600">
                       Available Stock: {item.availableStock}
                     </p>
                  </div>
                ))}
              </div>

               <ReserveButton
                  productId={product.id}
               />
              </div>
             ))}
           </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-4">
              🏢 Warehouses
            </h2>

            <ul className="space-y-3">
              {warehouses.map((warehouse: any) => (
                <li
                  key={warehouse.id}
                  className="border-b pb-2"
                >
                  {warehouse.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition mt-6">
          <h2 className="text-xl font-semibold mb-4">
            📋 Recent Reservations
          </h2>

          <div className="space-y-4">
            {reservations.map((reservation: any) => (
              <div
                key={reservation.id}
                className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition"
              >
                <div className="mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      reservation.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>

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
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition mt-6">
          <h2 className="text-xl font-semibold mb-4">
            📊 Inventory Overview
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-3">
                    Product
                  </th>
                  <th className="text-left p-3">
                    Warehouse
                  </th>
                  <th className="text-left p-3">
                    Total Stock
                  </th>
                  <th className="text-left p-3">
                    Reserved
                  </th>
                  <th className="text-left p-3">
                    Available
                  </th>
                </tr>
              </thead>

              <tbody>
                {inventory.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-3">
                      {item.product}
                    </td>

                    <td className="p-3">
                      {item.warehouse}
                    </td>

                    <td className="p-3">
                      {item.totalStock}
                    </td>

                    <td className="p-3">
                      {item.reservedStock}
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      {item.availableStock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <footer className="text-center text-slate-500 mt-8">
          Built with Next.js, Prisma & Supabase
      </footer>

    </main>
  );
}