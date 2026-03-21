import { RepositoryInterface } from "@/common/domain/repositories/repository.interface";
import { StudentModel } from "../models/student.model";

export type CreateStudentsProps = {
  id?: string;
  ra: string;
  name: string;
  email: string;
  cpf: string;
  created_by: string | null;
  updated_by: string | null;
  created_at?: Date;
  updated_at?: Date;
};

export interface StudentsRepository extends RepositoryInterface<
  StudentModel,
  CreateStudentsProps
> {
  conflictingCpf(cpf: string): Promise<void>;
  conflictingRa(ra: string): Promise<void>;
}
