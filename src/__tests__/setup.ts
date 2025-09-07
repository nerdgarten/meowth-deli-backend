// Mock environment variables
process.env.JWT_SECRET = "test-jwt-secret";
process.env.PASSWORD_SECRET = "test-password-secret";
process.env.BCRYPT_SALT_ROUNDS = "10";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";

// Global test timeout
jest.setTimeout(30000);
