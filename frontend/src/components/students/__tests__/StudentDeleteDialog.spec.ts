import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import StudentDeleteDialog from '../StudentDeleteDialog.vue'
import type { Student } from '@/types/student'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.visualViewport = {
  width: 1024,
  height: 768,
  offsetLeft: 0,
  offsetTop: 0,
  pageLeft: 0,
  pageTop: 0,
  scale: 1,
  onresize: null,
  onscroll: null,
  onscrollend: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
} as unknown as VisualViewport

const vuetify = createVuetify({ components, directives })

const mockStudent: Student = {
  id: '1',
  ra: '12345',
  name: 'João Silva',
  email: 'joao@example.com',
  cpf: '12345678901',
  created_by: null,
  updated_by: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

function mountDialog(props: Record<string, unknown> = {}) {
  return mount(StudentDeleteDialog, {
    props: { modelValue: true, student: mockStudent, ...props },
    global: { plugins: [vuetify] },
    attachTo: document.body,
  })
}

describe('StudentDeleteDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('visual rendering', () => {
    it('shows "Confirmar exclusão" as the dialog title when open', () => {
      mountDialog()
      expect(document.body.textContent).toContain('Confirmar exclusão')
    })

    it('shows the student name in the confirmation message', () => {
      mountDialog()
      expect(document.body.textContent).toContain('João Silva')
    })

    it('warns the user that the action cannot be undone', () => {
      mountDialog()
      expect(document.body.textContent).toContain('não pode ser desfeita')
    })

    it('renders both Cancelar and Excluir buttons', () => {
      mountDialog()
      const buttons = Array.from(document.querySelectorAll('button'))
      const texts = buttons.map(b => b.textContent?.trim())
      expect(texts).toEqual(expect.arrayContaining(['Cancelar', 'Excluir']))
    })

    it('does not render dialog content when modelValue is false', () => {
      mountDialog({ modelValue: false })
      expect(document.body.textContent).not.toContain('Confirmar exclusão')
    })
  })

  describe('loading state', () => {
    it('disables the Cancelar button while a delete is in progress', () => {
      mountDialog({ loading: true })
      const buttons = Array.from(document.querySelectorAll('button'))
      const cancelBtn = buttons.find(b => b.textContent?.trim() === 'Cancelar')
      expect(cancelBtn?.disabled).toBe(true)
    })

    it('enables the Cancelar button when not loading', () => {
      mountDialog({ loading: false })
      const buttons = Array.from(document.querySelectorAll('button'))
      const cancelBtn = buttons.find(b => b.textContent?.trim() === 'Cancelar')
      expect(cancelBtn?.disabled).toBe(false)
    })
  })

  describe('user interactions', () => {
    it('emits "confirm" when the user clicks Excluir', async () => {
      const wrapper = mountDialog()
      const buttons = Array.from(document.querySelectorAll('button'))
      const excluirBtn = buttons.find(b => b.textContent?.trim() === 'Excluir')
      excluirBtn?.click()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('confirm')).toHaveLength(1)
    })

    it('emits "cancel" when the user clicks Cancelar', async () => {
      const wrapper = mountDialog()
      const buttons = Array.from(document.querySelectorAll('button'))
      const cancelBtn = buttons.find(b => b.textContent?.trim() === 'Cancelar')
      cancelBtn?.click()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })
  })
})
