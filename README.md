# Meowth Deli Backend

## Start Docker

To start the PostgreSQL database, run:

```
docker compose up -d
```

```
DATABASE_URL="postgresql://root:12345@localhost:5434/nerdgarten"
JWT_SECRET="secretkey"
PASSWORD_SECRET="secretkey"
```

---

## Prisma Migrate

```
npx prisma generate
```

then

```
npx prisma migrate
```
