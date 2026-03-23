import "reflect-metadata";
import { DataSource } from "typeorm";
import { Student } from "./src/modules/students/infrastructure/typeorm/entities/student.entity";
import { StudentsDataBuilder } from "./src/modules/students/testing/helpers/students-data-builder";
import { RevokedToken } from "./src/modules/users/infrastructure/typeorm/entities/revoked-token.entity";
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
  entities: [User, RevokedToken, Student],
  synchronize: false,
  logging: false,
});

(global as any).testDataSource = testDataSource;
(global as any).UsersDataBuilder = UsersDataBuilder;
(global as any).StudentsDataBuilder = StudentsDataBuilder;
