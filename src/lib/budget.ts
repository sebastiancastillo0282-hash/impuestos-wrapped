// Presupuesto 2025 — Decreto 36-2024
// Fuentes: Congreso de la República + AGN + Bloomberg Línea
// Total aprobado: Q148,526,047,690

export type BudgetCategory = {
  key: string
  label: string
  amount: number   // en millones de quetzales (budget size, not user allocation)
  pct: number      // porcentaje del presupuesto total
  emoji: string
  description: string
  viralFact?: string
}

export const BUDGET_TOTAL = 148526047690

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    key: 'educacion',
    label: 'Educación',
    amount: 25649,
    pct: 17.27,
    emoji: '📚',
    description: 'Ministerio de Educación (MINEDUC)',
    viralFact: 'Guatemala destina 3.1% del PIB a educación. Costa Rica: 6.7%.',
  },
  {
    key: 'salud',
    label: 'Salud',
    amount: 15199,
    pct: 10.23,
    emoji: '🏥',
    description: 'Ministerio de Salud Pública (MSPAS)',
    viralFact: 'El Estado gasta en salud la mitad de lo que se evadió en impuestos en 2023.',
  },
  {
    key: 'deuda',
    label: 'Deuda pública',
    amount: 18499,
    pct: 12.46,
    emoji: '💳',
    description: 'Pago de intereses y amortizaciones',
    viralFact: 'Guatemala debe Q253,000 millones en total. La deuda nueva 2025: Q25,104 millones — la más alta en la historia.',
  },
  {
    key: 'municipalidades',
    label: 'Municipalidades',
    amount: 13389,
    pct: 9.01,
    emoji: '🏘️',
    description: 'Transferencias a municipios y CODEDES',
    viralFact: 'Q13,389 millones distribuidos entre 340 municipios. La rendición de cuentas a nivel local es mínima.',
  },
  {
    key: 'infraestructura',
    label: 'Infraestructura',
    amount: 9929,
    pct: 6.69,
    emoji: '🛣️',
    description: 'Ministerio de Comunicaciones, Infraestructura y Vivienda (CIV)',
  },
  {
    key: 'justicia',
    label: 'Justicia',
    amount: 8708,
    pct: 5.86,
    emoji: '⚖️',
    description: 'Sistema de justicia (MP, OJ, PDH, CC)',
  },
  {
    key: 'pensiones',
    label: 'Pensiones',
    amount: 8626,
    pct: 5.81,
    emoji: '👴',
    description: 'Pensiones civiles y programas adulto mayor',
  },
  {
    key: 'seguridad',
    label: 'Seguridad',
    amount: 8272,
    pct: 5.57,
    emoji: '🚔',
    description: 'Ministerio de Gobernación (PNC, DGSP)',
  },
  {
    key: 'defensa',
    label: 'Defensa',
    amount: 4260,
    pct: 2.87,
    emoji: '🪖',
    description: 'Ministerio de Defensa Nacional (Ejército)',
  },
  {
    key: 'desarrollo_social',
    label: 'Desarrollo Social',
    amount: 2579,
    pct: 1.74,
    emoji: '🤝',
    description: 'Ministerio de Desarrollo Social (MIDES)',
  },
  {
    key: 'congreso',
    label: 'Congreso',
    amount: 1465,
    pct: 0.99,
    emoji: '🏛️',
    description: 'Congreso de la República',
    viralFact: 'En febrero 2025, los 160 diputados se subieron el salario de Q29,150 a Q47,700 base — hasta Q67,300 con dietas.',
  },
  {
    key: 'otros',
    label: 'Otros',
    amount: 31951,
    pct: 21.51,
    emoji: '📋',
    description: 'Resto de entidades del Estado',
  },
]

export function allocateBudget(taxPaid: number): Array<BudgetCategory & { amount: number }> {
  const totalPct = BUDGET_CATEGORIES.reduce((acc, cat) => acc + cat.pct, 0)
  return BUDGET_CATEGORIES.map(cat => ({
    ...cat,
    amount: (cat.pct / totalPct) * taxPaid,
  }))
}
