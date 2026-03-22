import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url('VITE_API_URL deve ser uma URL válida'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors
  const messages = Object.entries(errors)
    .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
    .join('\n')

  throw new Error(`Variáveis de ambiente inválidas:\n${messages}`)
}

export const env = parsed.data
