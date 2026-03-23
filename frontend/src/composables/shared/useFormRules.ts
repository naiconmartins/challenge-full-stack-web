export function useFormRules() {
  const required = (label: string) => (v: string) => !!v || `${label} é obrigatório`

  const email = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Informe um e-mail válido'

  const minLength = (n: number) => (v: string) => v.length >= n || `Mínimo ${n} caracteres`

  return { required, email, minLength }
}
