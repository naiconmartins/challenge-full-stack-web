import type {
  CreateStudentDto,
  ListStudentsParams,
  Student,
  StudentListResponse,
  UpdateStudentDto,
} from '@/domain/entities/student.entity'

export interface IStudentRepository {
  list(params?: ListStudentsParams): Promise<StudentListResponse>
  getById(id: string): Promise<Student>
  create(data: CreateStudentDto): Promise<Student>
  update(id: string, data: UpdateStudentDto): Promise<Student>
  delete(id: string): Promise<void>
}
