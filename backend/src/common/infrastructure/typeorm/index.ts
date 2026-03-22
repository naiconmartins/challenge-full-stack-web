import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../env";

const ext = process.env.NODE_ENV === "production" ? ".js" : ".ts";

export const dataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  schema: env.DB_SCHEMA,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASS,
  entities: [`**/entities/**/*${ext}`],
  migrations: [`**/migrations/**/*${ext}`],
  synchronize: false,
  logging: false,
});
