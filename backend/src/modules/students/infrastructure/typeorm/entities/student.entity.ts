import { StudentModel } from "@/modules/students/domain/models/student.model";
import { User } from "@/modules/users/infrastructure/typeorm/entities/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("students")
export class Student implements StudentModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, update: false })
  ra: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, update: false })
  cpf: string;

  @Column({ type: "uuid", nullable: true })
  created_by: string | null;

  @Column({ type: "uuid", nullable: true })
  updated_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdByUser: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "updated_by" })
  updatedByUser: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
