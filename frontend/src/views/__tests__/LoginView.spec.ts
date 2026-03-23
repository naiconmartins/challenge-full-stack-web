import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import LoginView from '../LoginView.vue'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const mocks = vi.hoisted(() => ({
  handleLogin: vi.fn(),
  showPassword: false,
  errorMessage: '',
  isLoading: false,
  emailErrors: [] as string[],
  passwordErrors: [] as string[],
  consumedSessionExpiredFlag: false,
}))

vi.mock('@/composables/auth/useLoginForm', async () => {
  const { ref, reactive } = await import('vue')
  return {
    useLoginForm: () => ({
      formRef: ref(null),
      form: reactive({ email: '', password: '' }),
      fieldErrors: reactive({ email: mocks.emailErrors, password: mocks.passwordErrors }),
      showPassword: ref(mocks.showPassword),
      errorMessage: ref(mocks.errorMessage),
      isLoading: ref(mocks.isLoading),
      emailRules: [],
      passwordRules: [],
      handleLogin: mocks.handleLogin,
    }),
  }
})

vi.mock('@/infra/http', () => ({
  consumeSessionExpiredFlag: () => false,
}))

const vuetify = createVuetify({ components, directives })

function mountLogin() {
  return mount(LoginView, {
    global: { plugins: [vuetify] },
  })
}

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.showPassword = false
    mocks.errorMessage = ''
    mocks.isLoading = false
    mocks.emailErrors = []
    mocks.passwordErrors = []
  })

  describe('visual rendering', () => {
    it('renders the page title "Módulo Acadêmico"', () => {
      const wrapper = mountLogin()
      expect(wrapper.text()).toContain('Módulo Acadêmico')
    })

    it('renders the email input field', () => {
      const wrapper = mountLogin()
      const emailInput = wrapper.findAll('input').find(i => i.attributes('type') === 'email')
      expect(emailInput?.exists()).toBe(true)
    })

    it('renders the password input field hidden by default', () => {
      const wrapper = mountLogin()
      const passwordInput = wrapper.findAll('input').find(i => i.attributes('type') === 'password')
      expect(passwordInput?.exists()).toBe(true)
    })

    it('renders the Entrar submit button', () => {
      const wrapper = mountLogin()
      expect(wrapper.text()).toContain('Entrar')
    })
  })

  describe('error message', () => {
    it('shows error alert when errorMessage is set', () => {
      mocks.errorMessage = 'Credenciais inválidas.'
      const wrapper = mountLogin()
      expect(wrapper.text()).toContain('Credenciais inválidas.')
    })

    it('does not show error alert when errorMessage is empty', () => {
      const wrapper = mountLogin()
      expect(wrapper.find('.v-alert').exists()).toBe(false)
    })

    it('shows field-level error for email from 422 validation response', () => {
      mocks.emailErrors = ['E-mail já está em uso']
      const wrapper = mountLogin()
      expect(wrapper.text()).toContain('E-mail já está em uso')
    })

    it('shows field-level error for password', () => {
      mocks.passwordErrors = ['Senha incorreta']
      const wrapper = mountLogin()
      expect(wrapper.text()).toContain('Senha incorreta')
    })
  })

  describe('loading state', () => {
    it('disables the Entrar button while login request is in progress', () => {
      mocks.isLoading = true
      const wrapper = mountLogin()
      const entrarBtn = wrapper.findAll('button').find(b => b.text().includes('Entrar'))
      expect(entrarBtn?.attributes('disabled')).toBeDefined()
    })
  })

  describe('password visibility', () => {
    it('shows password as plain text when showPassword is true', () => {
      mocks.showPassword = true
      const wrapper = mountLogin()
      const passwordInput = wrapper.findAll('input').find(i => i.attributes('autocomplete') === 'current-password')
      expect(passwordInput?.attributes('type')).toBe('text')
    })

    it('hides password when showPassword is false', () => {
      const wrapper = mountLogin()
      const passwordInput = wrapper.findAll('input').find(i => i.attributes('autocomplete') === 'current-password')
      expect(passwordInput?.attributes('type')).toBe('password')
    })
  })

  describe('form submission', () => {
    it('calls handleLogin when the form is submitted', async () => {
      const wrapper = mountLogin()
      await wrapper.find('form').trigger('submit')
      expect(mocks.handleLogin).toHaveBeenCalled()
    })
  })
})
