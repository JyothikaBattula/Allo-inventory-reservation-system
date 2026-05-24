### ALLO Inventory Reservation System

## Overview

This project is a solution for the Allo Engineering Take-Home Exercise.

The goal of the system is to prevent overselling inventory during the checkout process. Instead of reducing stock immediately when a product is added to cart or waiting until payment succeeds, the system introduces a reservation mechanism.

When a user begins checkout, inventory is temporarily reserved for a limited period of time. During this reservation window, the reserved quantity is unavailable to other users.

If the payment succeeds, the reservation is confirmed and stock is permanently deducted.

If the payment fails, the user cancels checkout, or the reservation expires, the reserved quantity is released back into inventory.

---

## Problem Statement

In a real-world ecommerce environment, payment flows can take several minutes.

During this time:

- Other users may attempt to purchase the same product.
- Inventory must not be oversold.
- Inventory should not remain blocked forever if the customer abandons checkout.

This project solves that problem using temporary inventory reservations.

---

# Tech Stack

## Frontend

- Next.js 16 
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js Route Handlers
- Prisma ORM

## Database

- Supabase PostgreSQL

---

# System Architecture

The application consists of four core entities:

## Product

Represents an item that can be purchased.

Fields:

- id
- name

---

## Warehouse

Represents a warehouse where stock is stored.

Fields:

- id
- name

---

## Inventory

Represents stock levels for a product in a warehouse.

Fields:

- productId
- warehouseId
- totalStock
- reservedStock

Available stock is calculated as:

```text
availableStock = totalStock - reservedStock
```

---

## Reservation

Represents a temporary hold on inventory.

Fields:

- id
- productId
- warehouseId
- quantity
- status
- expiresAt
- createdAt

Reservation status:

### PENDING

Reservation exists and inventory is currently held.

### CONFIRMED

Payment succeeded.

Inventory becomes permanently deducted.

### RELEASED

Reservation was cancelled or expired.

Reserved stock is returned to inventory.

---

# Database Design

Relationship structure:

```text
Product
   |
   | 1:N
   |
Inventory
   |
   | N:1
   |
Warehouse

Reservation
   |
   | references
   |
Product + Warehouse
```

Each inventory record belongs to:

- one product
- one warehouse

Each reservation references:

- one product
- one warehouse

---

# Features Implemented

## Product Listing

Displays:

- Product name
- Product ID
- Warehouse
- Available stock
- Reserve button

---

## Inventory Reservation

Users can reserve inventory directly from the product page.

During reservation:

1. Available stock is validated.
2. Reserved stock is increased.
3. Reservation record is created.
4. Expiry timestamp is generated.

---

## Reservation Checkout Page

Displays:

- Product information
- Warehouse information
- Quantity
- Reservation status
- Live countdown timer
- Confirm Purchase button
- Cancel Reservation button

---

## Confirm Reservation

When payment succeeds:

1. Reservation status becomes CONFIRMED.
2. Total stock is permanently reduced.
3. Reserved stock is reduced.
4. User is redirected back to dashboard.

---

## Cancel Reservation

When payment fails or user cancels:

1. Reservation status becomes RELEASED.
2. Reserved stock is returned.
3. User is redirected back to dashboard.

---

## Reservation Expiry

Reservations expire after 15 minutes.

When an expired reservation is accessed:

1. Reservation is automatically released.
2. Reserved stock is returned.
3. User receives a Reservation Expired message.

---

# API Endpoints

## GET /api/products

Returns product information.

---

## GET /api/warehouses

Returns warehouse information.

---

## GET /api/inventory

Returns inventory information.

---

## POST /api/reservations

Creates a reservation.

### Success

Returns reservation details.

### Error

Returns:

```text
409 Not Enough Stock Available
```

when requested quantity exceeds available inventory.

---

## GET /api/reservations/list

Returns all reservations.

---

## POST /api/reservations/confirm

Confirms a reservation.

### Success

Reservation status becomes CONFIRMED.

### Error

Returns:

```text
410 Reservation Expired
```

if the reservation has expired.

---

## POST /api/reservations/release

Releases a reservation.

### Success

Reservation status becomes RELEASED.

---

# Error Handling

## 404

Inventory or reservation not found.

---

## 409

Not enough stock available.

---

## 410

Reservation expired.

---

# Concurrency Handling

Reservation creation is executed inside a Prisma transaction.

The transaction:

1. Reads inventory.
2. Validates available stock.
3. Updates reserved stock.
4. Creates the reservation.

This ensures reservation creation and inventory updates happen together.

### Future Improvement

For production-scale systems, I would strengthen concurrency guarantees using:

- PostgreSQL row-level locking (SELECT FOR UPDATE)
- Redis distributed locking

These approaches provide stronger protection when multiple users attempt to reserve the final available unit simultaneously.

---

# Expiry Mechanism

This implementation uses a lazy cleanup strategy.

When a reservation is accessed:

- expiry time is checked
- expired reservations are automatically released
- reserved inventory is restored

### Alternative Production Approaches

- Vercel Cron Jobs
- Background Workers
- Queue-based cleanup services

---

# Assumptions

- Reservation duration is fixed at 15 minutes.
- Inventory is reserved immediately when a reservation is created.
- Released reservations return stock to inventory.
- Confirmed reservations permanently reduce stock.
- Reservations cannot be confirmed after expiry.

---

# Running Locally

## Install dependencies

```bash
npm install
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run migrations

```bash
npx prisma migrate dev
```

## Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Seed Data

The database is pre-populated with:

- 5 Products
- 2 Warehouses
- Inventory records
- Reservation support

This allows the application to be tested immediately after deployment.

---

# Trade-Offs

Due to time constraints, I focused on implementing the complete reservation lifecycle end-to-end.

I chose:

- Prisma transactions for consistency
- Lazy cleanup for expired reservations
- Simple UI focused on functionality

With more time I would add:

- Row-level locking
- Idempotency support
- Background cleanup jobs
- Authentication
- Reservation analytics
- Warehouse inventory management UI

---

# Author

Jyothika Battula
22MIS7208