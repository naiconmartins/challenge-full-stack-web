import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import StudentFormView from '../StudentFormView.vue'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const mocks = vi.hoisted(() => ({
  handleSubmit: vi.fn(),
  handleCancel: vi.fn(),
  isEditMode: false,
  isFetching: false,
  isLoading: false,
  errorMessage: '',
  form: { ra: '', name: '', email: '', cpf: '' },
  fieldErrors: { ra: [] as string[], name: [] as string[], email: [] as string[], cpf: [] as string[] },
}))

vi.mock('@/composables/students/useStudentForm', async () => {
  const { ref, reactive, computed } = await import('vue')
  return {
    useStudentForm: () => ({
      formRef: ref(null),
      form: reactive({ ...mocks.form }),
      fieldErrors: reactive({ ...mocks.fieldErrors }),
      isEditMode: computed(() => mocks.isEditMode),
      isLoading: ref(mocks.isLoading),
      isFetching: ref(mocks.isFetching),
      errorMessage: ref(mocks.errorMessage),
      raRules: [],
      nameRules: [],
      emailRules: [],
      cpfRules: [],
      handleSubmit: mocks.handleSubmit,
      handleCancel: mocks.handleCancel,
    }),
  }
})

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({ logout: vi.fn() }),
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return { ...actual, useRouter: () => ({ push: vi.fn() }) }
})

const vuetify = createVuetify({ components, directives })

function mountForm() {
  return mount(StudentFormView, {
    global: {
      plugins: [vuetify],
      stubs: { AppSidebar: true },
    },
  })
}

describe('StudentFormView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isEditMode = false
    mocks.isFetching = false
    mocks.isLoading = false
    mocks.errorMessage = ''
    mocks.form = { ra: '', name: '', email: '', cpf: '' }
    mocks.fieldErrors = { ra: [], name: [], email: [], cpf: [] }
  })

  describe('create mode', () => {
    it('shows "Cadastrar Aluno" as the page title', () => {
      const wrapper = mountForm()
      expect(wrapper.text()).toContain('Cadastrar Aluno')
    })

    it('shows the create subtitle', () => {
      const wrapper = mountForm()
      expect(wrapper.text()).toContain('Preencha os dados para cadastrar um novo aluno')
    })

    it('renders all four form fields', () => {
      const wrapper = mountForm()
      const text = wrapper.text()
      expect(text).toContain('Registro Acadêmico (RA)')
      expect(text).toContain('CPF')
      expect(text).toContain('Nome')
      expect(text).toContain('E-mail')
    })
  })

  describe('edit mode', () => {
    beforeEach(() => { mocks.isEditMode = true })

    it('shows "Editar Aluno" as the page title', () => {
      const wrapper = mountForm()
      expect(wrapper.text()).toContain('Editar Aluno')
    })

    it('shows the edit subtitle', () => {
      const wrapper = mountForm()
      expect(wrapper.text()).toContain('Atualize os dados do aluno')
    })

    it('makes RA field readonly', () => {
      mocks.form.ra = '12345'
      const wrapper = mountForm()
      const raInput = wrapper.findAll('input').find(i => i.element.value === '12345')
      expect(raInput?.attributes('readonly')).toBeDefined()
    })

    it('makes CPF field readonly', () => {
      mocks.form.cpf = '123.456.789-01'
      const wrapper = mountForm()
      const cpfInput = wrapper.findAll('input').find(i => i.element.value === '123.456.789-01')
      expect(cpfInput?.attributes('readonly')).toBeDefined()
    })
  })

  describe('fetching state', () => {
    it('shows a loading spinner while fetching student data', () => {
      mocks.isFetching = true
      const wrapper = mountForm()
      expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
    })

    it('hides the form while fetching', () => {
      mocks.isFetching = true
      const wrapper = mountForm()
      expect(wrapper.find('form').exists()).toBe(false)
    })

    it('shows the form when fetching is complete', () => {
      const wrapper = mountForm()
      expect(wrapper.find('form').exists()).toBe(true)
    })
  })

  describe('error display', () => {
    it('shows error alert when errorMessage is set', () => {
      mocks.errorMessage = 'E-mail já cadastrado.'
      const wrapper = mountForm()
      expect(wrapper.text()).toContain('E-mail já cadastrado.')
    })

    it('hides error alert when errorMessage is empty', () => {
      const wrapper = mountForm()
      expect(wrapper.find('.v-alert').exists()).toBe(false)
    })

    it('shows field error for name', () => {
      mocks.fieldErrors.name = ['Nome é obrigatório']
      const wrapper = mountForm()
      expect(wrapper.text()).toContain('Nome é obrigatório')
    })

    it('shows field error for email', () => {
      mocks.fieldErrors.email = ['E-mail inválido']
      const wrapper = mountForm()
      expect(wrapper.text()).toContain('E-mail inválido')
    })
  })

  describe('loading state', () => {
    it('disables the Cancelar button during submission', () => {
      mocks.isLoading = true
      const wrapper = mountForm()
      const cancelarBtn = wrapper.findAll('button').find(b => b.text().includes('Cancelar'))
      expect(cancelarBtn?.attributes('disabled')).toBeDefined()
    })

    it('disables the Salvar button during submission', () => {
      mocks.isLoading = true
      const wrapper = mountForm()
      const salvarBtn = wrapper.findAll('button').find(b => b.text().includes('Salvar'))
      expect(salvarBtn?.attributes('disabled')).toBeDefined()
    })
  })

  describe('action buttons', () => {
    it('calls handleCancel when Cancelar is clicked', async () => {
      const wrapper = mountForm()
      const cancelarBtn = wrapper.findAll('button').find(b => b.text().includes('Cancelar'))
      await cancelarBtn!.trigger('click')
      expect(mocks.handleCancel).toHaveBeenCalledOnce()
    })

    it('calls handleSubmit when form is submitted', async () => {
      const wrapper = mountForm()
      await wrapper.find('form').trigger('submit')
      expect(mocks.handleSubmit).toHaveBeenCalledOnce()
    })
  })
})
