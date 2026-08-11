# Doctor Tracker — Backend

This repository contains the backend API for the Doctor Tracker application, a lightweight patient and appointment management service for clinics and individual practitioners.

## Description

Doctor Tracker Backend is a RESTful API that manages users, doctors, patients, and appointments. It provides authentication, role-based access, and CRUD operations so the frontend apps (web and mobile) can manage clinic data reliably and securely.

## Setup Guide

Follow these steps to get the project running locally.

1. Install dependencies

```bash
npm install
```

2. Create an environment file

Copy the example env and fill in values:

```bash
cp .env.example .env
```

3. Set up the database

- This project uses PostgreSQL with Prisma. Make sure you have a Postgres instance running and set `DATABASE_URL` in your `.env`.
- Run migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

4. Start the server

```bash
npm run dev
```

5. API docs

The API routes are defined under `src/app/module/*/*.route.ts`. Use Postman or similar to explore endpoints or add OpenAPI documentation as needed.

### .env.example

See `.env.example` for required environment variables.

## System Architecture

- **Client (Web/Mobile):** Sends authenticated requests to the backend.
- **Backend (this repo):** Express + TypeScript app exposing REST endpoints. Uses middleware for auth, validation, and error handling.
- **Database:** PostgreSQL managed via Prisma ORM. Prisma client lives in `src/generated/prisma`.
- **Data Flow:** Client → HTTP Request → Express Router → Controller → Service → Prisma Client → Postgres → Controller → Response → Client.

Sequence example:

1. Client calls `POST /auth/login` with credentials.
2. Auth controller validates and calls Auth service.
3. Auth service verifies user via Prisma, returns JWT.
4. Client uses JWT for subsequent API calls.

## Technical Decisions

1. Choice of Prisma + PostgreSQL

- Rationale: Prisma provides a strong, type-safe ORM with excellent developer DX for TypeScript projects. We initially planned to use MongoDB, but encountered issues with the MongoDB account setup which prevented reliable use of hosted Mongo instances. To avoid delays and keep development stable, we switched to PostgreSQL and adapted the Prisma schema accordingly.
- Trade-offs: Postgres provides ACID guarantees and relational modeling which fits clinical data well. We lose some of MongoDB's flexible document model but gain stronger relational integrity and query performance for joins.

2. REST API with JWT-based authentication

- Rationale: REST is simple, well-understood, and fits the resource-centric nature of this application (doctors, patients, appointments). JWTs provide stateless authentication that scales well across multiple backend instances.
- Trade-offs: GraphQL could provide more flexible querying for clients, but REST keeps the implementation simpler and easier to secure for this scope.

## Visual Evidence

This is a backend repository and does not include a UI, but you can provide the following screenshots in `docs/screenshots/`:

- `postman-desktop.png` — Example Postman collection running key endpoints (desktop layout)
- `postman-mobile.png` — Postman mobile view or mobile API client screenshot

Add images and reference them in the frontend README or API docs.

## API Overview (Highlights)

- `POST /auth/login` — Authenticate and receive JWT
- `GET /doctors` — List doctors
- `POST /patients` — Create a patient
- `GET /patients/:id` — Get patient details

Detailed endpoints are implemented in `src/app/module/*/*.route.ts`.

## Database Migrations

Migrations are stored in the `prisma/migrations/` folder. Use the included SQL migration files or run Prisma migrate commands to recreate the schema.


## Contributing

1. Fork the repository
2. Create a branch `feat/your-feature`
3. Open a PR to `main` with description and tests

## Troubleshooting

- If you see database connection errors, verify `DATABASE_URL` and Postgres availability.
- If Prisma client is missing, run `npm run prisma:generate`.

## License

MIT
