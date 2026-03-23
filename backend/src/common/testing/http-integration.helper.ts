import "reflect-metadata";

import "@/common/infrastructure/container";
import { BcryptjsHashProvider } from "@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { app } from "@/common/infrastructure/http/app";
import { dataSource } from "@/common/infrastructure/typeorm";
import { StudentModel } from "@/modules/students/domain/models/student.model";
import { Student } from "@/modules/students/infrastructure/typeorm/entities/student.entity";
import { StudentsDataBuilder } from "@/modules/students/testing/helpers/students-data-builder";
import { UserModel } from "@/modules/users/domain/models/users.model";
import { RevokedToken } from "@/modules/users/infrastructure/typeorm/entities/revoked-token.entity";
import { User } from "@/modules/users/infrastructure/typeorm/entities/users.entity";
import { UsersDataBuilder } from "@/modules/users/testing/helpers/users-data-builder";
import { AddressInfo } from "node:net";
import { Server } from "node:http";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export type HttpResponse<T = unknown> = {
  status: number;
  body: T | null;
};

export type SeedUserInput = Partial<UserModel> & {
  plainPassword?: string;
};

export class HttpIntegrationContext {
  private server: Server | null = null;
  readonly hashProvider = new BcryptjsHashProvider();
  baseUrl = "";

  async start(): Promise<void> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    this.server = await new Promise<Server>(resolve => {
      const httpServer = app.listen(0, () => resolve(httpServer));
    });

    const address = this.server.address() as AddressInfo;
    this.baseUrl = `http://127.0.0.1:${address.port}`;
  }

  async stop(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server?.close(error => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
      this.server = null;
    }

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }

  async clearDatabase(): Promise<void> {
    await dataSource.manager.query("DELETE FROM students");
    await dataSource.manager.query("DELETE FROM revoked_tokens");
    await dataSource.manager.query("DELETE FROM users");
  }

  async request<T = unknown>(
    path: string,
    options: RequestOptions = {},
  ): Promise<HttpResponse<T>> {
    const headers: Record<string, string> = {};

    if (options.body !== undefined) {
      headers["content-type"] = "application/json";
    }

    if (options.token) {
      headers.authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    let body: T | null = null;

    if (contentType.includes("application/json")) {
      body = (await response.json()) as T;
    }

    return {
      status: response.status,
      body,
    };
  }

  async seedUser(input: SeedUserInput = {}): Promise<{
    user: UserModel;
    plainPassword: string;
  }> {
    const plainPassword = input.plainPassword ?? "123456";
    const hashedPassword = await this.hashProvider.generateHash(plainPassword);
    const user = dataSource.manager.create(
      User,
      UsersDataBuilder({
        ...input,
        password: hashedPassword,
      }),
    );

    await dataSource.manager.save(user);

    return {
      user,
      plainPassword,
    };
  }

  async seedStudent(input: Partial<StudentModel> = {}): Promise<StudentModel> {
    const student = dataSource.manager.create(Student, StudentsDataBuilder(input));
    await dataSource.manager.save(student);
    return student;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<string> {
    const response = await this.request<{ access_token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: credentials,
      },
    );

    if (response.status !== 200 || !response.body) {
      throw new Error("Unable to authenticate seeded user");
    }

    return response.body.access_token;
  }

  async countRevokedTokens(token: string): Promise<number> {
    return dataSource.getRepository(RevokedToken).countBy({ token });
  }
}
