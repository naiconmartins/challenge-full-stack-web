import { ref } from 'vue'
import { ListStudentsUseCase } from '@/application/use-cases/students/list-students.use-case'
import { GetStudentUseCase } from '@/application/use-cases/students/get-student.use-case'
import { CreateStudentUseCase } from '@/application/use-cases/students/create-student.use-case'
import { UpdateStudentUseCase } from '@/application/use-cases/students/update-student.use-case'
import { DeleteStudentUseCase } from '@/application/use-cases/students/delete-student.use-case'
import { StudentRepositoryImpl } from '@/infrastructure/repositories/student.repository.impl'
import type { Student, StudentListResponse, ListStudentsParams, CreateStudentDto, UpdateStudentDto } from '@/domain/entities/student.entity'
import { AppError } from '@/domain/errors/app.error'

const studentRepository = new StudentRepositoryImpl()
const listStudentsUseCase = new ListStudentsUseCase(studentRepository)
const getStudentUseCase = new GetStudentUseCase(studentRepository)
const createStudentUseCase = new CreateStudentUseCase(studentRepository)
const updateStudentUseCase = new UpdateStudentUseCase(studentRepository)
const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository)

export function useStudents() {
  const students = ref<StudentListResponse | null>(null)
  const student = ref<Student | null>(null)
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  async function list(params?: ListStudentsParams): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      students.value = await listStudentsUseCase.execute(params)
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
    } finally {
      isLoading.value = false
    }
  }

  async function getById(id: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      student.value = await getStudentUseCase.execute(id)
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
    } finally {
      isLoading.value = false
    }
  }

  async function create(data: CreateStudentDto): Promise<Student> {
    isLoading.value = true
    error.value = null
    try {
      return await createStudentUseCase.execute(data)
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function update(id: string, data: UpdateStudentDto): Promise<Student> {
    isLoading.value = true
    error.value = null
    try {
      return await updateStudentUseCase.execute(id, data)
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await deleteStudentUseCase.execute(id)
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { students, student, isLoading, error, list, getById, create, update, remove }
}
