import { ref } from 'vue'
import { studentsService } from '@/services/students.service'
import type { Student, StudentListResponse, ListStudentsParams } from '@/types/student'
import { AppError } from '@/errors/app.error'

export function useStudentList() {
  const students = ref<Student[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const perPage = ref(10)
  const lastPage = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchTerm = ref('')

  async function fetchStudents(params?: ListStudentsParams): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response: StudentListResponse = await studentsService.list({
        page: currentPage.value,
        per_page: perPage.value,
        sort: 'name',
        sort_dir: 'asc',
        ...params,
      })
      students.value = response.items
      total.value = response.total
      currentPage.value = response.current_page
      lastPage.value = response.last_page
    } catch (err) {
      error.value = AppError.isAppError(err)
        ? err.message
        : 'Não foi possível carregar a lista de alunos. Atualize a página ou entre em contato com o suporte.'
    } finally {
      isLoading.value = false
    }
  }

  async function search(): Promise<void> {
    currentPage.value = 1
    await fetchStudents({ filter: searchTerm.value || undefined })
  }

  async function changePage(page: number): Promise<void> {
    currentPage.value = page
    await fetchStudents({ filter: searchTerm.value || undefined })
  }

  return {
    students,
    total,
    currentPage,
    perPage,
    lastPage,
    isLoading,
    error,
    searchTerm,
    fetchStudents,
    search,
    changePage,
  }
}
