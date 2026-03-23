import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { studentsService } from '@/services/students.service'
import { useFormRules } from '@/composables/shared/useFormRules'
import { useNotification } from '@/composables/shared/useNotification'
import { AppError } from '@/errors/app.error'

interface FormController {
  validate: () => Promise<{ valid: boolean }>
}

export function useStudentForm() {
  const route = useRoute()
  const router = useRouter()
  const { required, email } = useFormRules()
  const { notify } = useNotification()

  const isEditMode = computed(() => !!route.params.id)
  const studentId = computed(() => route.params.id as string)

  const formRef = ref<FormController | null>(null)
  const isLoading = ref(false)
  const isFetching = ref(false)
  const errorMessage = ref('')
  const loadFailed = ref(false)

  const form = reactive({
    ra: '',
    name: '',
    email: '',
    cpf: '',
  })

  const fieldErrors = reactive<{ name: string[]; email: string[]; ra: string[]; cpf: string[] }>({
    name: [],
    email: [],
    ra: [],
    cpf: [],
  })

  const raRules = [required('RA'), (v: string) => /^\d+$/.test(v) || 'RA deve conter apenas números']
  const nameRules = [required('Nome')]
  const emailRules = [required('E-mail'), email]
  const cpfRules = [required('CPF'), (v: string) => v.replace(/\D/g, '').length === 11 || 'Informe um CPF válido (11 dígitos)']

  function clearFieldErrors() {
    fieldErrors.name = []
    fieldErrors.email = []
    fieldErrors.ra = []
    fieldErrors.cpf = []
  }

  async function loadStudent(): Promise<void> {
    if (!isEditMode.value) return

    isFetching.value = true
    errorMessage.value = ''
    loadFailed.value = false
    try {
      const student = await studentsService.getById(studentId.value)
      form.ra = student.ra
      form.name = student.name
      form.email = student.email
      form.cpf = student.cpf
    } catch (err) {
      loadFailed.value = true
      errorMessage.value = AppError.isAppError(err)
        ? err.message
        : 'Não foi possível carregar os dados do aluno. Se o problema persistir, entre em contato com o suporte.'
    } finally {
      isFetching.value = false
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!formRef.value || loadFailed.value) return

    clearFieldErrors()
    errorMessage.value = ''

    const { valid } = await formRef.value.validate()
    if (!valid) return

    isLoading.value = true
    try {
      if (isEditMode.value) {
        await studentsService.update(studentId.value, { name: form.name, email: form.email })
        notify('Aluno atualizado com sucesso!')
      } else {
        await studentsService.create({
          ra: form.ra,
          name: form.name,
          email: form.email,
          cpf: form.cpf.replace(/\D/g, ''),
        })
        notify('Aluno cadastrado com sucesso!')
      }
      router.push({ name: 'home' })
    } catch (err) {
      if (AppError.isAppError(err)) {
        if (err.errors) {
          fieldErrors.name = err.errors['name'] ?? []
          fieldErrors.email = err.errors['email'] ?? []
          fieldErrors.ra = err.errors['ra'] ?? []
          fieldErrors.cpf = err.errors['cpf'] ?? []
          errorMessage.value = err.message
        } else {
          errorMessage.value = err.message
        }
      } else {
        errorMessage.value = 'Não foi possível salvar os dados. Se o problema persistir, entre em contato com o suporte.'
      }
    } finally {
      isLoading.value = false
    }
  }

  function handleCancel(): void {
    router.push({ name: 'home' })
  }

  async function retryLoadStudent(): Promise<void> {
    await loadStudent()
  }

  onMounted(() => loadStudent())

  return {
    formRef,
    form,
    fieldErrors,
    isEditMode,
    isLoading,
    isFetching,
    loadFailed,
    errorMessage,
    raRules,
    nameRules,
    emailRules,
    cpfRules,
    handleSubmit,
    handleCancel,
    retryLoadStudent,
  }
}
