# Multi-Vendor E-Commerce Marketplace

Production-oriented monorepo for a dynamic multi-vendor e-commerce marketplace.

## Current Status

Phase 0 foundation is scaffolded:

- npm workspace monorepo
- Express TypeScript API shell
- Next.js TypeScript web shell
- Shared contracts package
- MongoDB Atlas data layer with Mongoose models for identity, RBAC, and seed configuration
- Seed script for default roles, permissions, order statuses, global commission, and admin user
- No Docker requirement; the API connects directly to MongoDB Atlas
- OpenAPI documentation mount at `/docs`

## Local Setup

1. Install dependencies:

```powershell
npm.cmd install
```

2. Copy environment files:

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

3. Put your MongoDB Atlas connection string in `.env` and `backend/.env`:

```powershell
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/marketplace?retryWrites=true&w=majority
MONGODB_DB_NAME=marketplace
```

4. Seed the Atlas database:

```powershell
npm.cmd run db:seed
```

5. Start development servers:

```powershell
npm.cmd run dev
```

## Default Seed Admin

- Email: `admin@example.com`
- Password: `ChangeMeNow!12345`

Change this immediately after first login in any real environment.

## Architecture Notes

The backend is organized by clean architecture boundaries: routes, controllers, validators, services, repositories, middleware, config, database, and shared utilities. The frontend uses Next.js App Router with route areas for storefront, admin, vendor, and account experiences.

All configurable business concepts should be stored in MongoDB Atlas and exposed through admin workflows. Default seed data is allowed only as editable initial configuration.
