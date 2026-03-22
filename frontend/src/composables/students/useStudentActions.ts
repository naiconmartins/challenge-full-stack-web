import { ref } from 'vue'
import { DeleteStudentUseCase } from '@/application/use-cases/students/delete-student.use-case'
import { StudentRepositoryImpl } from '@/infrastructure/repositories/student.repository.impl'
import type { Student } from '@/domain/entities/student.entity'
import { AppError } from '@/domain/errors/app.error'

const studentRepository = new StudentRepositoryImpl()
const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository)

export function useStudentActions() {
  const deleteDialog = ref(false)
  const selectedStudent = ref<Student | null>(null)
  const isDeleting = ref(false)
  const deleteError = ref<string | null>(null)

  function openDeleteDialog(student: Student): void {
    selectedStudent.value = student
    deleteDialog.value = true
  }

  function closeDeleteDialog(): void {
    deleteDialog.value = false
    selectedStudent.value = null
    deleteError.value = null
  }

  async function confirmDelete(onSuccess: () => void): Promise<void> {
    if (!selectedStudent.value) return

    isDeleting.value = true
    deleteError.value = null
    try {
      await deleteStudentUseCase.execute(selectedStudent.value.id)
      closeDeleteDialog()
      onSuccess()
    } catch (err) {
      deleteError.value = AppError.isAppError(err) ? err.message : 'Erro ao excluir aluno.'
    } finally {
      isDeleting.value = false
    }
  }

  return {
    deleteDialog,
    selectedStudent,
    isDeleting,
    deleteError,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  }
}
