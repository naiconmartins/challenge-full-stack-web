import { ConflictError } from "@/common/domain/errors/conflict-error";
import { InMemoryRepository } from "@/common/domain/repositories/in-memory.repository";
import { StudentModel } from "@/modules/students/domain/models/student.model";
import { StudentsRepository } from "@/modules/students/domain/repositories/students.repository";

export class StudentsInMemoryRepository
  extends InMemoryRepository<StudentModel>
  implements StudentsRepository
{
  sortableFields: string[] = ["name", "created_at"];

  async conflictingCpf(cpf: string): Promise<void> {
    const student = this.items.find(item => item.cpf === cpf);
    if (student) {
      throw new ConflictError(`A student with this CPF already exists`);
    }
  }

  async conflictingRa(ra: string): Promise<void> {
    const student = this.items.find(item => item.ra === ra);
    if (student) {
      throw new ConflictError(`A student with this RA already exists`);
    }
  }

  async conflictingEmail(email: string, excludeId?: string): Promise<void> {
    const student = this.items.find(item => item.email === email);
    if (student && student.id !== excludeId) {
      throw new ConflictError(`A student with this email already exists`);
    }
  }

  protected async applyFilter(
    items: StudentModel[],
    filter: string | null,
  ): Promise<StudentModel[]> {
    if (!filter) return items;
    const lower = filter.toLowerCase();
    return items.filter(
      item =>
        item.name.toLowerCase().includes(lower) ||
        item.ra.includes(filter) ||
        item.cpf.includes(filter),
    );
  }
}
