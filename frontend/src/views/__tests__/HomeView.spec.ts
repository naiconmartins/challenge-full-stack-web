import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import HomeView from '../HomeView.vue'
import StudentSearchBar from '@/components/students/StudentSearchBar.vue'
import StudentTable from '@/components/students/StudentTable.vue'
import StudentDeleteDialog from '@/components/students/StudentDeleteDialog.vue'
import type { Student } from '@/types/student'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const mockStudent: Student = {
  id: '42',
  ra: '12345',
  name: 'João Silva',
  email: 'joao@example.com',
  cpf: '12345678901',
  created_by: null,
  updated_by: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

const mocks = vi.hoisted(() => ({
  fetchStudents: vi.fn(),
  search: vi.fn(),
  changePage: vi.fn(),
  openDeleteDialog: vi.fn(),
  closeDeleteDialog: vi.fn(),
  confirmDelete: vi.fn(),
  routerPush: vi.fn(),
  isLoading: false,
  error: null as string | null,
  searchTerm: '',
  currentPage: 1,
  perPage: 10,
  lastPage: 1,
  deleteDialog: false,
  selectedStudent: null as Student | null,
  isDeleting: false,
}))

vi.mock('@/composables/students/useStudentList', async () => {
  const { ref } = await import('vue')
  return {
    useStudentList: () => ({
      students: ref([mockStudent]),
      isLoading: ref(mocks.isLoading),
      error: ref(mocks.error),
      searchTerm: ref(mocks.searchTerm),
      currentPage: ref(mocks.currentPage),
      perPage: ref(mocks.perPage),
      lastPage: ref(mocks.lastPage),
      fetchStudents: mocks.fetchStudents,
      search: mocks.search,
      changePage: mocks.changePage,
    }),
  }
})

vi.mock('@/composables/students/useStudentActions', async () => {
  const { ref } = await import('vue')
  return {
    useStudentActions: () => ({
      deleteDialog: ref(mocks.deleteDialog),
      selectedStudent: ref(mocks.selectedStudent),
      isDeleting: ref(mocks.isDeleting),
      openDeleteDialog: mocks.openDeleteDialog,
      closeDeleteDialog: mocks.closeDeleteDialog,
      confirmDelete: mocks.confirmDelete,
    }),
  }
})

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return { ...actual, useRouter: () => ({ push: mocks.routerPush }) }
})

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({ logout: vi.fn() }),
}))

const vuetify = createVuetify({ components, directives })

function mountHome() {
  return mount(HomeView, {
    global: {
      plugins: [vuetify],
      stubs: { AppSidebar: true },
    },
  })
}

describe('HomeView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isLoading = false
    mocks.error = null
    mocks.searchTerm = ''
    mocks.deleteDialog = false
    mocks.selectedStudent = null
    mocks.isDeleting = false
  })

  describe('initial render', () => {
    it('renders the page title "Alunos"', () => {
      const wrapper = mountHome()
      expect(wrapper.text()).toContain('Alunos')
    })

    it('renders the StudentSearchBar component', () => {
      const wrapper = mountHome()
      expect(wrapper.findComponent(StudentSearchBar).exists()).toBe(true)
    })

    it('renders the StudentTable component', () => {
      const wrapper = mountHome()
      expect(wrapper.findComponent(StudentTable).exists()).toBe(true)
    })

    it('renders the StudentDeleteDialog component', () => {
      const wrapper = mountHome()
      expect(wrapper.findComponent(StudentDeleteDialog).exists()).toBe(true)
    })
  })

  describe('data loading', () => {
    it('calls fetchStudents on mount', () => {
      mountHome()
      expect(mocks.fetchStudents).toHaveBeenCalledOnce()
    })

    it('passes students to StudentTable', () => {
      const wrapper = mountHome()
      expect(wrapper.findComponent(StudentTable).props('students')).toEqual([mockStudent])
    })

    it('passes isLoading to StudentTable and StudentSearchBar', () => {
      mocks.isLoading = true
      const wrapper = mountHome()
      expect(wrapper.findComponent(StudentTable).props('loading')).toBe(true)
      expect(wrapper.findComponent(StudentSearchBar).props('loading')).toBe(true)
    })

    it('passes error from useStudentList to StudentTable', () => {
      mocks.error = 'Falha na conexão'
      const wrapper = mountHome()
      expect(wrapper.findComponent(StudentTable).props('error')).toBe('Falha na conexão')
    })
  })

  describe('search interactions', () => {
    it('calls search when StudentSearchBar emits "search"', () => {
      const wrapper = mountHome()
      wrapper.findComponent(StudentSearchBar).vm.$emit('search')
      expect(mocks.search).toHaveBeenCalledOnce()
    })

    it('resets searchTerm and calls fetchStudents when StudentSearchBar emits "clear"', () => {
      mocks.searchTerm = 'some search'
      const wrapper = mountHome()
      wrapper.findComponent(StudentSearchBar).vm.$emit('clear')
      expect(mocks.fetchStudents).toHaveBeenCalledTimes(2)
    })
  })

  describe('pagination', () => {
    it('calls changePage when StudentTable emits "page-change"', () => {
      const wrapper = mountHome()
      wrapper.findComponent(StudentTable).vm.$emit('page-change', 3)
      expect(mocks.changePage).toHaveBeenCalledWith(3)
    })
  })

  describe('navigation', () => {
    it('navigates to student-create when StudentSearchBar emits "create"', () => {
      const wrapper = mountHome()
      wrapper.findComponent(StudentSearchBar).vm.$emit('create')
      expect(mocks.routerPush).toHaveBeenCalledWith({ name: 'student-create' })
    })

    it('navigates to student-edit with student id when StudentTable emits "edit"', () => {
      const wrapper = mountHome()
      wrapper.findComponent(StudentTable).vm.$emit('edit', mockStudent)
      expect(mocks.routerPush).toHaveBeenCalledWith({ name: 'student-edit', params: { id: mockStudent.id } })
    })
  })

  describe('delete dialog', () => {
    it('calls openDeleteDialog when StudentTable emits "delete"', () => {
      const wrapper = mountHome()
      wrapper.findComponent(StudentTable).vm.$emit('delete', mockStudent)
      expect(mocks.openDeleteDialog).toHaveBeenCalledWith(mockStudent)
    })

    it('calls closeDeleteDialog when StudentDeleteDialog emits "cancel"', () => {
      const wrapper = mountHome()
      wrapper.findComponent(StudentDeleteDialog).vm.$emit('cancel')
      expect(mocks.closeDeleteDialog).toHaveBeenCalledOnce()
    })

    it('calls confirmDelete with a fetchStudents callback when StudentDeleteDialog emits "confirm"', () => {
      const wrapper = mountHome()
      wrapper.findComponent(StudentDeleteDialog).vm.$emit('confirm')
      expect(mocks.confirmDelete).toHaveBeenCalledOnce()
      const callback = mocks.confirmDelete.mock.calls[0][0] as () => void
      callback()
      expect(mocks.fetchStudents).toHaveBeenCalledTimes(2)
    })

    it('passes selectedStudent to StudentDeleteDialog', async () => {
      mocks.selectedStudent = mockStudent
      const wrapper = mountHome()
      await nextTick()
      expect(wrapper.findComponent(StudentDeleteDialog).props('student')).toEqual(mockStudent)
    })

    it('passes isDeleting to StudentDeleteDialog loading prop', async () => {
      mocks.isDeleting = true
      const wrapper = mountHome()
      await nextTick()
      expect(wrapper.findComponent(StudentDeleteDialog).props('loading')).toBe(true)
    })
  })
})
