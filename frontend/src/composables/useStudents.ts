import { ref } from 'vue'
import { studentsService } from '@/services/students.service'
import type { Student, StudentListResponse, ListStudentsParams, CreateStudentDto, UpdateStudentDto } from '@/types/student'
import { AppError } from '@/errors/app.error'

export function useStudents() {
  const students = ref<StudentListResponse | null>(null)
  const student = ref<Student | null>(null)
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  async function list(params?: ListStudentsParams): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      students.value = await studentsService.list(params)
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
      student.value = await studentsService.getById(id)
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
      return await studentsService.create(data)
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
      return await studentsService.update(id, data)
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
      await studentsService.delete(id)
    } catch (err) {
      error.value = AppError.isAppError(err) ? err : new AppError('Erro inesperado.', 0)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { students, student, isLoading, error, list, getById, create, update, remove }
}
