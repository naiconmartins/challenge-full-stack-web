import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStudentActions } from '../useStudentActions'
import { AppError } from '@/errors/app.error'
import type { Student } from '@/types/student'

const mocks = vi.hoisted(() => ({
  delete: vi.fn(),
  notify: vi.fn(),
}))

vi.mock('@/services/students.service', () => ({
  studentsService: { delete: mocks.delete },
}))

vi.mock('@/composables/shared/useNotification', () => ({
  useNotification: () => ({ notify: mocks.notify }),
}))

const mockStudent: Student = {
  id: '1',
  ra: '123',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  cpf: '00000000000',
  created_by: null,
  updated_by: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('useStudentActions', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('openDeleteDialog', () => {
    it('sets selectedStudent and opens the dialog', () => {
      const { openDeleteDialog, selectedStudent, deleteDialog } = useStudentActions()

      openDeleteDialog(mockStudent)

      expect(selectedStudent.value).toStrictEqual(mockStudent)
      expect(deleteDialog.value).toBe(true)
    })
  })

  describe('closeDeleteDialog', () => {
    it('resets dialog state', () => {
      const { openDeleteDialog, closeDeleteDialog, deleteDialog, selectedStudent } =
        useStudentActions()

      openDeleteDialog(mockStudent)
      closeDeleteDialog()

      expect(deleteDialog.value).toBe(false)
      expect(selectedStudent.value).toBeNull()
    })

    it('clears deleteError', () => {
      const { openDeleteDialog, confirmDelete, closeDeleteDialog, deleteError } =
        useStudentActions()

      mocks.delete.mockRejectedValueOnce(new AppError('Erro', 500))
      openDeleteDialog(mockStudent)
      confirmDelete(() => {}).catch(() => {})
      closeDeleteDialog()

      expect(deleteError.value).toBeNull()
    })
  })

  describe('confirmDelete', () => {
    it('does nothing when no student is selected', async () => {
      const { confirmDelete } = useStudentActions()
      const onSuccess = vi.fn()

      await confirmDelete(onSuccess)

      expect(mocks.delete).not.toHaveBeenCalled()
      expect(onSuccess).not.toHaveBeenCalled()
    })

    it('sets isDeleting to true while deleting and false after', async () => {
      let resolve!: () => void
      mocks.delete.mockReturnValue(new Promise<void>(res => { resolve = res }))

      const { openDeleteDialog, confirmDelete, isDeleting } = useStudentActions()
      openDeleteDialog(mockStudent)

      const promise = confirmDelete(() => {})
      expect(isDeleting.value).toBe(true)

      resolve()
      await promise

      expect(isDeleting.value).toBe(false)
    })

    it('calls delete with the selected student id', async () => {
      mocks.delete.mockResolvedValue(undefined)

      const { openDeleteDialog, confirmDelete } = useStudentActions()
      openDeleteDialog(mockStudent)
      await confirmDelete(() => {})

      expect(mocks.delete).toHaveBeenCalledWith('1')
    })

    it('closes dialog, notifies and calls onSuccess on success', async () => {
      mocks.delete.mockResolvedValue(undefined)

      const { openDeleteDialog, confirmDelete, deleteDialog, selectedStudent } =
        useStudentActions()
      const onSuccess = vi.fn()

      openDeleteDialog(mockStudent)
      await confirmDelete(onSuccess)

      expect(deleteDialog.value).toBe(false)
      expect(selectedStudent.value).toBeNull()
      expect(mocks.notify).toHaveBeenCalledWith('Aluno excluído com sucesso!')
      expect(onSuccess).toHaveBeenCalledOnce()
    })

    it('sets deleteError from AppError message on failure', async () => {
      mocks.delete.mockRejectedValue(new AppError('Não encontrado', 404, 'NOT_FOUND'))

      const { openDeleteDialog, confirmDelete, deleteError } = useStudentActions()
      openDeleteDialog(mockStudent)
      await confirmDelete(() => {})

      expect(deleteError.value).toBe('Não encontrado')
    })

    it('sets generic deleteError message for unknown errors', async () => {
      mocks.delete.mockRejectedValue(new Error('falha de rede'))

      const { openDeleteDialog, confirmDelete, deleteError } = useStudentActions()
      openDeleteDialog(mockStudent)
      await confirmDelete(() => {})

      expect(deleteError.value).toBe('Não foi possível excluir o aluno. Se o problema persistir, entre em contato com o suporte.')
    })

    it('does not call onSuccess on failure', async () => {
      mocks.delete.mockRejectedValue(new AppError('Erro', 500))

      const { openDeleteDialog, confirmDelete } = useStudentActions()
      const onSuccess = vi.fn()

      openDeleteDialog(mockStudent)
      await confirmDelete(onSuccess)

      expect(onSuccess).not.toHaveBeenCalled()
    })

    it('sets isDeleting to false even on error', async () => {
      mocks.delete.mockRejectedValue(new Error('falha'))

      const { openDeleteDialog, confirmDelete, isDeleting } = useStudentActions()
      openDeleteDialog(mockStudent)
      await confirmDelete(() => {})

      expect(isDeleting.value).toBe(false)
    })
  })
})
