import { describe, it, expect } from 'vitest'
import { maskCpf } from '../masks'

describe('maskCpf', () => {
  it('returns empty string for empty input', () => {
    expect(maskCpf('')).toBe('')
  })

  it('returns raw digits for input shorter than 4 digits', () => {
    expect(maskCpf('123')).toBe('123')
  })

  it('adds first dot after 3rd digit', () => {
    expect(maskCpf('1234')).toBe('123.4')
  })

  it('adds two dots for 7-digit input', () => {
    expect(maskCpf('1234567')).toBe('123.456.7')
  })

  it('formats a full 11-digit CPF', () => {
    expect(maskCpf('12345678901')).toBe('123.456.789-01')
  })

  it('formats an all-zero CPF', () => {
    expect(maskCpf('00000000000')).toBe('000.000.000-00')
  })

  it('strips non-numeric characters before formatting (idempotent on already formatted input)', () => {
    expect(maskCpf('123.456.789-01')).toBe('123.456.789-01')
  })

  it('output never exceeds 14 characters regardless of input length', () => {
    expect(maskCpf('123456789012345').length).toBeLessThanOrEqual(14)
  })
})
