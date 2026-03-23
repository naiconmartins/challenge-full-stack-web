import { describe, it, expect } from 'vitest'
import { useFormRules } from '../useFormRules'

describe('useFormRules', () => {
  const { required, email, minLength } = useFormRules()

  describe('required', () => {
    it('returns true for a non-empty string', () => {
      expect(required('Nome')('João')).toBe(true)
    })

    it('returns error message for an empty string', () => {
      expect(required('Nome')('')).toBe('Nome é obrigatório')
    })

    it('uses the provided label in the error message', () => {
      expect(required('E-mail')('')).toBe('E-mail é obrigatório')
    })
  })

  describe('email', () => {
    it('returns true for a valid email', () => {
      expect(email('usuario@exemplo.com')).toBe(true)
    })

    it('returns true for email with subdomain', () => {
      expect(email('usuario@email.exemplo.com')).toBe(true)
    })

    it('returns error message for string without @', () => {
      expect(email('invalido')).toBe('Informe um e-mail válido')
    })

    it('returns error message for string without domain extension', () => {
      expect(email('usuario@dominio')).toBe('Informe um e-mail válido')
    })

    it('returns error message for empty string', () => {
      expect(email('')).toBe('Informe um e-mail válido')
    })
  })

  describe('minLength', () => {
    it('returns true when length exactly meets the minimum', () => {
      expect(minLength(6)('abcdef')).toBe(true)
    })

    it('returns true when length exceeds the minimum', () => {
      expect(minLength(6)('abcdefgh')).toBe(true)
    })

    it('returns error message when length is below the minimum', () => {
      expect(minLength(6)('abc')).toBe('Mínimo 6 caracteres')
    })

    it('uses the provided minimum in the error message', () => {
      expect(minLength(10)('curto')).toBe('Mínimo 10 caracteres')
    })

    it('returns error message for empty string', () => {
      expect(minLength(1)('')).toBe('Mínimo 1 caracteres')
    })
  })
})
