import { ConflictError } from "@/common/domain/errors/conflict-error";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import {
  SearchInput,
  SearchOutput,
} from "@/common/domain/repositories/repository.interface";
import { StudentModel } from "@/modules/students/domain/models/student.model";
import {
  CreateStudentsProps,
  StudentsRepository,
} from "@/modules/students/domain/repositories/students.repository";
import { inject, injectable } from "tsyringe";
import { ILike, Repository } from "typeorm";
import { Student } from "../entities/student.entity";

@injectable()
export class StudentsTypeormRepository implements StudentsRepository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(
    @inject("StudentsDefaultTypeormRepository")
    private studentsRepository: Repository<Student>,
  ) {}

  async conflictingCpf(cpf: string): Promise<void> {
    const normalizedCpf = cpf.replace(/\D/g, "");
    const student = await this.studentsRepository
      .createQueryBuilder("student")
      .where("regexp_replace(student.cpf, '\\D', '', 'g') = :cpf", {
        cpf: normalizedCpf,
      })
      .getOne();
    if (student) {
      throw new ConflictError(`A student with this CPF already exists`);
    }
  }

  async conflictingRa(ra: string): Promise<void> {
    const student = await this.studentsRepository.findOneBy({ ra });
    if (student) {
      throw new ConflictError(`A student with this RA already exists`);
    }
  }

  async conflictingEmail(email: string, excludeId?: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const student = await this.studentsRepository
      .createQueryBuilder("student")
      .where("LOWER(student.email) = :email", {
        email: normalizedEmail,
      })
      .getOne();
    if (student && student.id !== excludeId) {
      throw new ConflictError(`A student with this email already exists`);
    }
  }

  create(props: CreateStudentsProps): StudentModel {
    return this.studentsRepository.create(props);
  }

  async insert(model: StudentModel): Promise<StudentModel> {
    return this.studentsRepository.save(model);
  }

  async findById(id: string): Promise<StudentModel> {
    return this._get(id);
  }

  async update(model: StudentModel): Promise<StudentModel> {
    await this._get(model.id);
    return this.studentsRepository.save(model);
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.studentsRepository.delete({ id });
  }

  async search(props: SearchInput): Promise<SearchOutput<StudentModel>> {
    const page = props.page ?? 1;
    const per_page = props.per_page ?? 15;
    const sort = props.sort ?? null;
    const sort_dir = props.sort_dir ?? null;
    const filter = props.filter ?? null;

    const dirOps = ["asc", "desc"];
    const validSort = sort !== null && this.sortableFields.includes(sort);
    const validSortDir =
      sort_dir !== null && dirOps.includes(sort_dir.toLowerCase());
    const orderByField = validSort ? sort : "created_at";
    const orderByDir = validSortDir ? sort_dir : "desc";

    const [students, total] = await this.studentsRepository.findAndCount({
      ...(filter && {
        where: [
          { name: ILike(`%${filter}%`) },
          { ra: ILike(`%${filter}%`) },
          { cpf: ILike(`%${filter}%`) },
        ],
      }),
      order: { [orderByField]: orderByDir },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    return {
      items: students,
      per_page,
      total,
      current_page: page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter,
    };
  }

  protected async _get(id: string): Promise<StudentModel> {
    const student = await this.studentsRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundError(`Student not found using ID ${id}`);
    }
    return student;
  }
}
