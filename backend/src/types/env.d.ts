export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_PORT?: string;
      DB_NAME: string;
      DB_HOST: string;
      DB_PORT: number;
      DB_USER: string;
      DB_PASSWORD: string;
    }
  }
}
