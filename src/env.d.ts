declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    SALT_ROUNDS: string;
    EMAIL_PORT: number;
    EMAIL_SECURE: boolean;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
    EMAIL_HOST: string;
    PASSWORD_SECRET: string;
    PORT: number;
  }
}
