import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createVuetify } from 'vuetify'
import { VPagination } from 'vuetify/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import StudentTable from '../StudentTable.vue'
import type { Student } from '@/types/student'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const vuetify = createVuetify({ components, directives })

const mockStudents: Student[] = [
  {
    id: '1',
    ra: '12345',
    name: 'João Silva',
    email: 'joao@example.com',
    cpf: '12345678901',
    created_by: null,
    updated_by: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    ra: '67890',
    name: 'Maria Santos',
    email: 'maria@example.com',
    cpf: '98765432100',
    created_by: null,
    updated_by: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

function mountTable(props: Record<string, unknown> = {}) {
  return mount(StudentTable, {
    props: {
      students: mockStudents,
      currentPage: 1,
      perPage: 10,
      lastPage: 1,
      ...props,
    },
    global: { plugins: [vuetify] },
  })
}

describe('StudentTable', () => {
  describe('visual rendering', () => {
    it('renders student names', async () => {
      const wrapper = mountTable()
      await nextTick()
      expect(wrapper.text()).toContain('João Silva')
      expect(wrapper.text()).toContain('Maria Santos')
    })

    it('renders student emails', async () => {
      const wrapper = mountTable()
      await nextTick()
      expect(wrapper.text()).toContain('joao@example.com')
      expect(wrapper.text()).toContain('maria@example.com')
    })

    it('renders student RAs', async () => {
      const wrapper = mountTable()
      await nextTick()
      expect(wrapper.text()).toContain('12345')
      expect(wrapper.text()).toContain('67890')
    })

    it('formats raw CPF digits from the API into XXX.XXX.XXX-XX format', async () => {
      const wrapper = mountTable()
      await nextTick()
      expect(wrapper.text()).toContain('123.456.789-01')
      expect(wrapper.text()).toContain('987.654.321-00')
    })

    it('shows an error alert when error prop has a message', () => {
      const wrapper = mountTable({ error: 'Erro ao carregar alunos' })
      expect(wrapper.text()).toContain('Erro ao carregar alunos')
    })

    it('does not show error alert when there is no error', () => {
      const wrapper = mountTable({ error: null })
      expect(wrapper.find('.v-alert').exists()).toBe(false)
    })

    it('shows "Nenhum aluno encontrado" when students list is empty', async () => {
      const wrapper = mountTable({ students: [] })
      await nextTick()
      expect(wrapper.text()).toContain('Nenhum aluno encontrado')
    })

    it('renders sortable headers for RA, Nome, E-mail and CPF', async () => {
      const wrapper = mountTable()
      await nextTick()

      const sortableHeaders = wrapper.findAll('th.v-data-table__th--sortable')

      expect(sortableHeaders).toHaveLength(4)
      expect(wrapper.text()).toContain('Reg. Acadêmico (RA)')
      expect(wrapper.text()).toContain('Nome')
      expect(wrapper.text()).toContain('E-mail')
      expect(wrapper.text()).toContain('CPF')
    })

    it('keeps sort icons visible for sortable columns', async () => {
      const wrapper = mountTable()
      await nextTick()

      const sortIcons = wrapper.findAll('.v-data-table-header__sort-icon')

      expect(sortIcons).toHaveLength(4)
      expect(wrapper.find('.student-table').exists()).toBe(true)
    })
  })

  describe('pagination', () => {
    it('shows pagination when lastPage is greater than 1', () => {
      const wrapper = mountTable({ lastPage: 3 })
      expect(wrapper.findComponent(VPagination).exists()).toBe(true)
    })

    it('hides pagination when lastPage is 1', () => {
      const wrapper = mountTable({ lastPage: 1 })
      expect(wrapper.findComponent(VPagination).exists()).toBe(false)
    })

    it('emits "page-change" with the selected page number', async () => {
      const wrapper = mountTable({ lastPage: 3, currentPage: 1 })
      await wrapper.findComponent(VPagination).vm.$emit('update:modelValue', 2)
      expect(wrapper.emitted('page-change')).toBeTruthy()
      expect(wrapper.emitted('page-change')![0]).toEqual([2])
    })
  })

  describe('action buttons', () => {
    it('emits "edit" with the correct student when edit button is clicked', async () => {
      const wrapper = mountTable()
      await nextTick()
      const editBtns = wrapper.findAll('button').filter(b => b.html().includes('mdi-pencil-outline'))
      await editBtns[0].trigger('click')
      expect(wrapper.emitted('edit')).toHaveLength(1)
      expect(wrapper.emitted('edit')![0]).toEqual([mockStudents[0]])
    })

    it('emits "delete" with the correct student when delete button is clicked', async () => {
      const wrapper = mountTable()
      await nextTick()
      const deleteBtns = wrapper.findAll('button').filter(b => b.html().includes('mdi-trash-can-outline'))
      await deleteBtns[0].trigger('click')
      expect(wrapper.emitted('delete')).toHaveLength(1)
      expect(wrapper.emitted('delete')![0]).toEqual([mockStudents[0]])
    })

    it('emits "edit" for the second student when second edit button is clicked', async () => {
      const wrapper = mountTable()
      await nextTick()
      const editBtns = wrapper.findAll('button').filter(b => b.html().includes('mdi-pencil-outline'))
      await editBtns[1].trigger('click')
      expect(wrapper.emitted('edit')![0]).toEqual([mockStudents[1]])
    })
  })
})
