declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    SALT_ROUNDS: string;
  }
}
