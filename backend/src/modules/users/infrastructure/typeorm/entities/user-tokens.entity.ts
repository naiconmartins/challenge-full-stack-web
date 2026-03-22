import { UserTokensModel } from "@/modules/users/domain/models/user-token.model";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user_tokens")
export class UserToken implements UserTokensModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Generated("uuid")
  @Column({ unique: true })
  token: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
