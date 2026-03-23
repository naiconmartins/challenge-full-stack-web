import { ref } from 'vue'
import { studentsService } from '@/services/students.service'
import { useNotification } from '@/composables/shared/useNotification'
import type { Student } from '@/types/student'
import { AppError } from '@/errors/app.error'

export function useStudentActions() {
  const { notify } = useNotification()
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
      await studentsService.delete(selectedStudent.value.id)
      closeDeleteDialog()
      notify('Aluno excluído com sucesso!')
      onSuccess()
    } catch (err) {
      deleteError.value = AppError.isAppError(err)
        ? err.message
        : 'Não foi possível excluir o aluno. Se o problema persistir, entre em contato com o suporte.'
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
