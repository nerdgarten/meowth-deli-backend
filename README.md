# Meowth Deli Backend

A Node.js backend API for a food delivery platform built with Express.js, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 Authentication & Authorization (JWT)
- 🍕 Food delivery management system
- 👥 Multi-role support (Customer, Driver, Restaurant, Admin)
- 📦 Order management with status tracking
- 💳 Payment processing
- 🎫 Coupon system
- 🏪 Restaurant management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Testing**: Jest
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- pnpm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nerdgarten/meowth-deli-backend.git
cd meowth-deli-backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://root:12345@localhost:5434/nerdgarten"
JWT_SECRET="secretkey"
PASSWORD_SECRET="secretkey"
```

### 4. Database Setup

Start PostgreSQL with Docker:

```bash
pnpm run db:setup
```

This command will:

- Start the PostgreSQL container
- Generate Prisma client
- Push the schema to the database

### 5. Start Development Server

```bash
pnpm run dev
```

The server will start on the default port with hot reload enabled.

## Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm test` - Run tests
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run test:coverage` - Run tests with coverage report
- `pnpm run db:setup` - Setup database (Docker + Prisma)
- `pnpm run db:teardown` - Teardown database containers

## Database Management

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev
```

### View Database

```bash
npx prisma studio
```

### Reset Database

```bash
pnpm run db:teardown
pnpm run db:setup
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

## Project Structure

```
src/
├── __tests__/          # Test files
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middlewares/        # Express middlewares
├── repositories/       # Data access layer
├── routes/             # API routes
├── services/           # Business logic
├── types/              # TypeScript type definitions
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

## Testing

Run all tests:

```bash
pnpm test
```

Run tests with coverage:

```bash
pnpm run test:coverage
```

Run tests in watch mode:

```bash
pnpm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
