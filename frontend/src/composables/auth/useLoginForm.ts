import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { useFormRules } from '@/composables/shared/useFormRules'
import { AppError } from '@/errors/app.error'
import { consumeSessionExpiredFlag } from '@/infra/http'

export function useLoginForm() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { isLoading } = storeToRefs(authStore)
  const { required, email, minLength } = useFormRules()

  const formRef = ref()
  const showPassword = ref(false)
  const errorMessage = ref('')

  const form = reactive({
    email: '',
    password: '',
  })

  const fieldErrors = reactive<{ email: string[]; password: string[] }>({
    email: [],
    password: [],
  })

  if (consumeSessionExpiredFlag()) {
    errorMessage.value = 'Sua sessão expirou. Faça login novamente.'
  }

  const emailRules = [required('E-mail'), email]
  const passwordRules = [required('Senha'), minLength(6)]

  function clearFieldErrors() {
    fieldErrors.email = []
    fieldErrors.password = []
  }

  async function handleLogin() {
    clearFieldErrors()
    errorMessage.value = ''

    const { valid } = await formRef.value.validate()
    if (!valid) return

    try {
      await authStore.login({ email: form.email, password: form.password })
      router.push('/')
    } catch (err) {
      if (AppError.isAppError(err)) {
        if (err.errors) {
          fieldErrors.email = err.errors['email'] ?? []
          fieldErrors.password = err.errors['password'] ?? []
        }
        errorMessage.value = err.message
      } else {
        errorMessage.value = 'Ocorreu um erro inesperado. Tente novamente.'
      }
    }
  }

  return {
    formRef,
    form,
    fieldErrors,
    showPassword,
    errorMessage,
    isLoading,
    emailRules,
    passwordRules,
    handleLogin,
  }
}
