declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    EMAIL_PORT: string;
    EMAIL_USER: number;
    EMAIL_PASSWORD: string;
    EMAIL_HOST: string;
  }
}
