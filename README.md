# Luxe Scentique — High-End Perfume E-Commerce Platform

> "The Classic Sophisticate" — Gold & Onyx

A full-stack Nx monorepo for the Luxe Scentique luxury fragrance brand.

---

## Architecture

```
luxe-scentique/
├── apps/
│   ├── api/              # NestJS backend (port 3000)
│   ├── storefront/       # Next.js customer frontend (port 4200)
│   └── admin-panel/      # Angular admin dashboard (port 4201)
├── libs/
│   └── shared-types/     # Shared TypeScript DTOs, Interfaces & Enums
└── Agent-helper-files/   # Brand assets (hero images, logo)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS 10 + Prisma + PostgreSQL |
| Customer Frontend | Next.js 14 + Tailwind CSS + Shadcn UI |
| Admin Dashboard | Angular 18 + PrimeNG |
| Storage | Cloudflare R2 |
| Payments | Paystack (Ghana) |
| Auth | Google OAuth + JWT |
| Monorepo | Nx 20 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database
- Google Cloud project (for OAuth)
- Paystack account
- Cloudflare R2 bucket

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# Seed database (super-admin + sample products)
npm run prisma:seed
```

### 4. Copy Hero Images to Storefront Public

```bash
cp Agent-helper-files/hero-1.jpg apps/storefront/public/images/
cp Agent-helper-files/hero-2.jpg apps/storefront/public/images/
cp Agent-helper-files/logo.png apps/storefront/public/images/
```

### 5. Run Applications

```bash
# API (NestJS)
npm run start:api

# Storefront (Next.js)
npm run start:storefront

# Admin Panel (Angular)
npm run start:admin
```

---

## API Documentation

Once the API is running, visit: **http://localhost:3000/docs**

Full OpenAPI/Swagger documentation with all endpoints.

---

## Key Features

### Customer Storefront
- High-converting hero section with brand imagery
- Product grid with vibe/price/brand filtering
- Order tracking — no login required (use email, phone, or order number)
- Transparent pricing: service fee shown separately
- Google Sign-In for account management

### Admin Dashboard
- Real-time dashboard (sales, inventory alerts)
- Full inventory CRUD with image uploads to R2
- Order management with status workflow (Pending → Delivered)
- POS Mode for recording walk-in sales manually

### Backend API
- Google OAuth → JWT authentication
- Role-based access control (Customer, Admin, Super Admin)
- Paystack payment integration with automatic service fee calculation
- Cloudflare R2 file storage
- Full Swagger documentation

---

## Service Fee Calculation (Paystack Ghana)

| Component | Value |
|-----------|-------|
| Rate | 1.95% of subtotal |
| Minimum | GHS 0.50 |
| Maximum cap | GHS 1,000 |

Formula: `serviceFee = max(0.50, min(subtotal × 0.0195, 1000))`

---

## Standards

- **TypeScript:** `strict: true` — zero `any` types
- **ESLint:** SonarJS rules for code quality
- **Prettier:** Single quotes, 100 char width
- **Accessibility:** ARIA labels, keyboard navigation throughout

---

## Super Admin

The email `abubakaribilal99@gmail.com` is automatically seeded as `SUPER_ADMIN` on first Google Sign-In.

---

## Generating API Clients from Swagger

```bash
# 1. Start the API
npm run start:api

# 2. Download the OpenAPI spec
curl http://localhost:3000/docs-json > openapi.json

# 3. Generate Next.js types (using openapi-typescript)
npx openapi-typescript openapi.json -o apps/storefront/lib/api-types.ts

# 4. Generate Angular client (using openapi-generator)
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-angular \
  -o apps/admin-panel/src/app/core/api-client
```
