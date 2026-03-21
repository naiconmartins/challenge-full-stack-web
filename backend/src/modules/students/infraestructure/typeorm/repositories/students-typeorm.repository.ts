import { ConflictError } from "@/common/domain/errors/conflit-error";
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
    const student = await this.studentsRepository.findOneBy({ cpf });
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
    await this.studentsRepository.update({ id: model.id }, model);
    return model;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.studentsRepository.delete({ id });
  }

  async search(props: SearchInput): Promise<SearchOutput<StudentModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false;
    const dirOps = ["asc", "desc"];
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) ||
      false;
    const orderByField = validSort ? props.sort : "created_at";
    const orderByDir = validSortDir ? props.sort_dir : "desc";

    const [students, total] = await this.studentsRepository.findAndCount({
      ...(props.filter && {
        where: [
          { name: ILike(`%${props.filter}%`) },
          { ra: ILike(`%${props.filter}%`) },
          { cpf: ILike(`%${props.filter}%`) },
        ],
      }),
      order: { [orderByField]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    });

    return {
      items: students,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
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
