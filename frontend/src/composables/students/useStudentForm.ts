import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GetStudentUseCase } from '@/application/use-cases/students/get-student.use-case'
import { CreateStudentUseCase } from '@/application/use-cases/students/create-student.use-case'
import { UpdateStudentUseCase } from '@/application/use-cases/students/update-student.use-case'
import { StudentRepositoryImpl } from '@/infrastructure/repositories/student.repository.impl'
import { useFormRules } from '@/composables/shared/useFormRules'
import { AppError } from '@/domain/errors/app.error'

const studentRepository = new StudentRepositoryImpl()
const getStudentUseCase = new GetStudentUseCase(studentRepository)
const createStudentUseCase = new CreateStudentUseCase(studentRepository)
const updateStudentUseCase = new UpdateStudentUseCase(studentRepository)

export function useStudentForm() {
  const route = useRoute()
  const router = useRouter()
  const { required, email } = useFormRules()

  const isEditMode = computed(() => !!route.params.id)
  const studentId = computed(() => route.params.id as string)

  const formRef = ref()
  const isLoading = ref(false)
  const isFetching = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

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

  const cpfRule = (v: string) =>
    /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(v.replace(/\D/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')) ||
    /^\d{11}$/.test(v.replace(/\D/g, '')) ||
    'Informe um CPF válido (11 dígitos)'

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
    try {
      const student = await getStudentUseCase.execute(studentId.value)
      form.ra = student.ra
      form.name = student.name
      form.email = student.email
      form.cpf = student.cpf
    } catch (err) {
      errorMessage.value = AppError.isAppError(err) ? err.message : 'Erro ao carregar dados do aluno.'
    } finally {
      isFetching.value = false
    }
  }

  async function handleSubmit(): Promise<void> {
    clearFieldErrors()
    errorMessage.value = ''
    successMessage.value = ''

    const { valid } = await formRef.value.validate()
    if (!valid) return

    isLoading.value = true
    try {
      if (isEditMode.value) {
        await updateStudentUseCase.execute(studentId.value, {
          name: form.name,
          email: form.email,
        })
        successMessage.value = 'Aluno atualizado com sucesso!'
      } else {
        await createStudentUseCase.execute({
          ra: form.ra,
          name: form.name,
          email: form.email,
          cpf: form.cpf.replace(/\D/g, ''),
        })
        successMessage.value = 'Aluno cadastrado com sucesso!'
      }
      setTimeout(() => router.push({ name: 'home' }), 1000)
    } catch (err) {
      if (AppError.isAppError(err)) {
        if (err.errors) {
          fieldErrors.name = err.errors['name'] ?? []
          fieldErrors.email = err.errors['email'] ?? []
          fieldErrors.ra = err.errors['ra'] ?? []
          fieldErrors.cpf = err.errors['cpf'] ?? []
        }
        errorMessage.value = err.message
      } else {
        errorMessage.value = 'Ocorreu um erro inesperado. Tente novamente.'
      }
    } finally {
      isLoading.value = false
    }
  }

  function handleCancel(): void {
    router.push({ name: 'home' })
  }

  onMounted(() => loadStudent())

  return {
    formRef,
    form,
    fieldErrors,
    isEditMode,
    isLoading,
    isFetching,
    errorMessage,
    successMessage,
    raRules,
    nameRules,
    emailRules,
    cpfRules,
    handleSubmit,
    handleCancel,
  }
}
