export type TaxType = 'employee' | 'independiente' | 'empresa'

export type TaxProfile =
  | { type: 'employee'; grossAnnual: number }
  | { type: 'independiente'; grossAnnual: number }
  | { type: 'empresa'; netProfit: number }

export type TaxResult = {
  isr: number
  igss: number
  total: number
  grossIncome: number
}

const EMPLOYEE_DEDUCTIONS = 60000 // Q48,000 personal + Q12,000 IVA (SAT Decreto 10-2012)
const IGSS_RATE = 0.0483
const ISR_TRAMO1_RATE = 0.05
const ISR_TRAMO1_LIMIT = 300000
const ISR_TRAMO1_MAX = 15000
const ISR_TRAMO2_RATE = 0.07
const SIMPLIFICADO_RATE1 = 0.05
const SIMPLIFICADO_LIMIT = 360000
const SIMPLIFICADO_BASE = 18000
const SIMPLIFICADO_RATE2 = 0.07
const EMPRESAS_RATE = 0.25

export function calculateEmployeeIGSS(grossAnnual: number): number {
  return grossAnnual * IGSS_RATE
}

export function calculateEmployeeISR(grossAnnual: number): number {
  const igss = calculateEmployeeIGSS(grossAnnual)
  const taxableIncome = Math.max(0, grossAnnual - EMPLOYEE_DEDUCTIONS - igss)

  if (taxableIncome <= ISR_TRAMO1_LIMIT) {
    return taxableIncome * ISR_TRAMO1_RATE
  }
  return ISR_TRAMO1_MAX + (taxableIncome - ISR_TRAMO1_LIMIT) * ISR_TRAMO2_RATE
}

export function calculateSimplificadoISR(grossAnnual: number): number {
  if (grossAnnual <= SIMPLIFICADO_LIMIT) {
    return grossAnnual * SIMPLIFICADO_RATE1
  }
  return SIMPLIFICADO_BASE + (grossAnnual - SIMPLIFICADO_LIMIT) * SIMPLIFICADO_RATE2
}

export function calculateEmpresaISR(netProfit: number): number {
  return netProfit * EMPRESAS_RATE
}

export function calculateTotalTax(profile: TaxProfile): TaxResult {
  let isr = 0
  let igss = 0
  let grossIncome = 0

  if (profile.type === 'employee') {
    grossIncome = profile.grossAnnual
    isr = calculateEmployeeISR(profile.grossAnnual)
    igss = calculateEmployeeIGSS(profile.grossAnnual)
  } else if (profile.type === 'independiente') {
    grossIncome = profile.grossAnnual
    isr = calculateSimplificadoISR(profile.grossAnnual)
  } else {
    grossIncome = profile.netProfit
    isr = calculateEmpresaISR(profile.netProfit)
  }

  return { isr, igss, total: isr + igss, grossIncome }
}
