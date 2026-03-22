import "reflect-metadata";
import { DataSource } from "typeorm";
import { Student } from "./src/modules/students/infrastructure/typeorm/entities/student.entity";
import { UserToken } from "./src/modules/users/infrastructure/typeorm/entities/user-tokens.entity";
import { User } from "./src/modules/users/infrastructure/typeorm/entities/users.entity";
import { UsersDataBuilder } from "./src/modules/users/testing/helpers/users-data-builder";

const testDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  schema: process.env.DB_SCHEMA ?? "public",
  database: process.env.DB_NAME ?? "grupoa",
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "postgres",
  entities: [User, UserToken, Student],
  synchronize: false,
  logging: false,
});

(global as any).testDataSource = testDataSource;
(global as any).UsersDataBuilder = UsersDataBuilder;
