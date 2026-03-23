import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRevokedTokens1774200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "revoked_tokens",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "token",
            type: "text",
            isUnique: true,
          },
          {
            name: "revoked_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        indices: [
          {
            name: "IDX_REVOKED_TOKENS_TOKEN",
            columnNames: ["token"],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("revoked_tokens");
  }
}
