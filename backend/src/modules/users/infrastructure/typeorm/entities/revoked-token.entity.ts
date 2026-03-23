import { RevokedTokenModel } from "@/modules/users/domain/models/revoked-token.model";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("revoked_tokens")
export class RevokedToken implements RevokedTokenModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", unique: true })
  token: string;

  @CreateDateColumn()
  revoked_at: Date;
}
