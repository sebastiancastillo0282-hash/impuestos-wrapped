import { describe, it, expect } from 'vitest'
import {
  calculateEmployeeISR,
  calculateEmployeeIGSS,
  calculateSimplificadoISR,
  calculateEmpresaISR,
  calculateTotalTax,
  type TaxProfile,
} from '../taxes'

describe('calculateEmployeeIGSS', () => {
  it('calculates 4.83% of gross annual', () => {
    expect(calculateEmployeeIGSS(120000)).toBeCloseTo(5796, 0)
  })
  it('returns 0 for 0 income', () => {
    expect(calculateEmployeeIGSS(0)).toBe(0)
  })
})

describe('calculateEmployeeISR', () => {
  it('returns 0 when gross is below exento', () => {
    // Q60,000 gross → IGSS Q2,898 → taxable Q60,000 - Q60,000 - Q2,898 = -Q2,898 → ISR Q0
    expect(calculateEmployeeISR(60000)).toBe(0)
  })
  it('applies 5% on taxable income under Q300,000', () => {
    // Q120,000 gross → IGSS Q5,796 → taxable Q120,000 - Q60,000 - Q5,796 = Q54,204 → ISR Q2,710.20
    expect(calculateEmployeeISR(120000)).toBeCloseTo(2710.20, 0)
  })
  it('applies Q15,000 + 7% on taxable income over Q300,000', () => {
    // Q500,000 gross → IGSS Q24,150 → taxable Q500,000 - Q60,000 - Q24,150 = Q415,850
    // ISR = Q15,000 + (Q415,850 - Q300,000) * 0.07 = Q15,000 + Q8,109.50 = Q23,109.50
    expect(calculateEmployeeISR(500000)).toBeCloseTo(23109.50, 0)
  })
})

describe('calculateSimplificadoISR', () => {
  it('applies 5% on gross income under Q360,000', () => {
    expect(calculateSimplificadoISR(200000)).toBeCloseTo(10000, 0)
  })
  it('applies Q18,000 + 7% on gross income over Q360,000', () => {
    // Q500,000 → Q18,000 + (Q500,000 - Q360,000) * 0.07 = Q18,000 + Q9,800 = Q27,800
    expect(calculateSimplificadoISR(500000)).toBeCloseTo(27800, 0)
  })
  it('returns 0 for 0 income', () => {
    expect(calculateSimplificadoISR(0)).toBe(0)
  })
})

describe('calculateEmpresaISR', () => {
  it('applies 25% on net profit', () => {
    expect(calculateEmpresaISR(400000)).toBeCloseTo(100000, 0)
  })
})

describe('calculateTotalTax', () => {
  it('returns ISR + IGSS for employee', () => {
    const profile: TaxProfile = { type: 'employee', grossAnnual: 120000 }
    const result = calculateTotalTax(profile)
    expect(result.isr).toBeCloseTo(2710.20, 0)
    expect(result.igss).toBeCloseTo(5796, 0)
    expect(result.total).toBeCloseTo(8506.20, 0)
  })
  it('returns ISR only for independiente', () => {
    const profile: TaxProfile = { type: 'independiente', grossAnnual: 200000 }
    const result = calculateTotalTax(profile)
    expect(result.isr).toBeCloseTo(10000, 0)
    expect(result.igss).toBe(0)
    expect(result.total).toBeCloseTo(10000, 0)
  })
  it('returns ISR only for empresa', () => {
    const profile: TaxProfile = { type: 'empresa', netProfit: 400000 }
    const result = calculateTotalTax(profile)
    expect(result.isr).toBeCloseTo(100000, 0)
    expect(result.igss).toBe(0)
  })
})
