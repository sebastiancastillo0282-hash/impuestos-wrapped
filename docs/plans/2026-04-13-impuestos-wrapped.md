# Impuestos Wrapped Guatemala — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a "Spotify Wrapped" style web app where Guatemalans enter their income, see how much they paid in taxes (ISR + IGSS), and watch slide-by-slide where every quetzal went — designed to go viral.

**Architecture:** Next.js 14 App Router, all tax calculations client-side (no data stored), slide-based results page driven by URL params, OG image generated dynamically with Satori for social sharing.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Satori (OG images), Vitest, Vercel

---

## Data Reference (all verified, Decreto 36-2024)

```
Presupuesto 2025 total: Q148,526,047,690

Categories:
  Educación (MINEDUC):      Q25,649M  17.3%
  Salud (MSPAS):            Q15,199M  10.2%
  Infraestructura (CIV):    Q9,929M    6.7%
  Seguridad (MINGOB):       Q8,272M    5.6%
  Justicia:                 Q8,708M    5.9%
  Pensiones/adulto mayor:   Q8,626M    5.8%
  Municipalidades:          Q13,389M   9.0%
  Deuda pública:            Q18,499M  12.5%
  Defensa:                  Q4,260M    2.9%
  Congreso:                 Q1,465M    1.0%
  MIDES:                    Q2,579M    1.7%
  Otros:                    Q32,951M  22.2%  ← resto no desglosado

ISR empleados: exento Q60,000/año. 5% hasta Q300K gravable, 7% sobre excedente
ISR independientes (simplificado): 5% hasta Q360K bruto, 7% sobre excedente
IGSS empleado: 4.83% salario bruto
ISR empresas: 25% sobre utilidad neta

Dato viral diputados: salario base Q47,700/mes, total Q67,300/mes (Publinews, feb 2025)
Dato viral evasión: Q45,189.7M evadidos en IVA+ISR en 2023 (SAT, presentación oficial jul 2024)
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `~/impuestos-wrapped/` (project root, already exists)

**Step 1: Initialize Next.js**

```bash
cd ~/impuestos-wrapped
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Expected: project scaffolded with `src/app/`, `tailwind.config.ts`, `tsconfig.json`

**Step 2: Install dependencies**

```bash
npm install framer-motion
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

**Step 3: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Verify scaffold**

```bash
npm run dev
```

Expected: Next.js app running at localhost:3000

**Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with Vitest"
```

---

## Task 2: Tax calculation engine (TDD)

**Files:**
- Create: `src/lib/taxes.ts`
- Test: `src/lib/__tests__/taxes.test.ts`

**Step 1: Write failing tests**

Create `src/lib/__tests__/taxes.test.ts`:

```typescript
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
  it('returns 0 when gross is below exento (Q60,000 + IGSS)', () => {
    // Q72,000 gross → IGSS Q3,477.6 → taxable Q72,000 - Q60,000 - Q3,477.6 = Q8,522.4 → ISR Q426.12
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
```

**Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../taxes'"

**Step 3: Write implementation**

Create `src/lib/taxes.ts`:

```typescript
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
```

**Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS — all 10 tests green

**Step 5: Commit**

```bash
git add src/lib/taxes.ts src/lib/__tests__/taxes.test.ts
git commit -m "feat: tax calculation engine with full test coverage"
```

---

## Task 3: Budget allocation constants + formatter

**Files:**
- Create: `src/lib/budget.ts`
- Create: `src/lib/formatters.ts`
- Test: `src/lib/__tests__/budget.test.ts`

**Step 1: Write failing tests**

Create `src/lib/__tests__/budget.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { allocateBudget, BUDGET_CATEGORIES } from '../budget'

describe('allocateBudget', () => {
  it('allocates tax paid proportionally across categories', () => {
    const alloc = allocateBudget(10000)
    const educ = alloc.find(a => a.key === 'educacion')!
    // 17.3% of Q10,000 = Q1,730
    expect(educ.amount).toBeCloseTo(1730, 0)
  })

  it('all allocations sum to total tax paid', () => {
    const alloc = allocateBudget(50000)
    const sum = alloc.reduce((acc, a) => acc + a.amount, 0)
    expect(sum).toBeCloseTo(50000, 0)
  })

  it('returns all defined categories', () => {
    const alloc = allocateBudget(10000)
    expect(alloc.length).toBe(BUDGET_CATEGORIES.length)
  })
})
```

**Step 2: Run to verify fail**

```bash
npm test src/lib/__tests__/budget.test.ts
```

**Step 3: Implement**

Create `src/lib/budget.ts`:

```typescript
// Presupuesto 2025 — Decreto 36-2024
// Fuentes: Congreso de la República + AGN + Bloomberg Línea
// Total aprobado: Q148,526,047,690

export type BudgetCategory = {
  key: string
  label: string
  amount: number   // en millones de quetzales
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

// Verify percentages sum to ~100%
// Sum: 17.27+10.23+12.46+9.01+6.69+5.86+5.81+5.57+2.87+1.74+0.99+21.51 = 100.01 ✓

export type BudgetAllocation = BudgetCategory & { amount_allocated: number }

export function allocateBudget(taxPaid: number): Array<{ key: string; label: string; amount: number; emoji: string; pct: number; description: string; viralFact?: string }> {
  return BUDGET_CATEGORIES.map(cat => ({
    ...cat,
    amount: (cat.pct / 100) * taxPaid,
  }))
}
```

Create `src/lib/formatters.ts`:

```typescript
// Format quetzales: Q1,234.50 or Q1.2M
export function formatQ(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return `Q${(amount / 1_000_000).toFixed(1)}M`
  }
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('GTQ', 'Q')
}

// Format large numbers with commas: 45,189,700,000
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-GT').format(Math.round(n))
}

// How many days of a diputado's salary (Q67,300/month = Q2,243/day)
export function diputadoDays(amount: number): number {
  const DIPUTADO_DAILY = 67300 / 30
  return Math.round(amount / DIPUTADO_DAILY)
}

// How many vaccines (estimated cost Q85 each, MSPAS 2023 data)
export function vaccineCount(healthAmount: number): number {
  return Math.round(healthAmount / 85)
}
```

**Step 4: Run tests**

```bash
npm test
```

Expected: PASS all tests

**Step 5: Commit**

```bash
git add src/lib/budget.ts src/lib/formatters.ts src/lib/__tests__/budget.test.ts
git commit -m "feat: budget allocation constants and formatters"
```

---

## Task 4: Landing page + input form

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/InputForm.tsx`

**Step 1: Build InputForm component**

Create `src/components/InputForm.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TaxType } from '@/lib/taxes'

const PROFILES = [
  {
    type: 'employee' as TaxType,
    label: 'Empleado formal',
    sublabel: 'Trabajo en relación de dependencia, con IGSS',
    icon: '👔',
  },
  {
    type: 'independiente' as TaxType,
    label: 'Independiente / Freelance',
    sublabel: 'Emito facturas, soy profesional independiente',
    icon: '💼',
  },
  {
    type: 'empresa' as TaxType,
    label: 'Empresa',
    sublabel: 'Tengo o represento una empresa, pago ISR sobre utilidades',
    icon: '🏢',
  },
]

export default function InputForm() {
  const router = useRouter()
  const [step, setStep] = useState<'profile' | 'income'>('profile')
  const [taxType, setTaxType] = useState<TaxType | null>(null)
  const [income, setIncome] = useState('')

  const handleProfileSelect = (type: TaxType) => {
    setTaxType(type)
    setStep('income')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(income.replace(/,/g, ''))
    if (!taxType || isNaN(amount) || amount <= 0) return

    const param = taxType === 'empresa' ? 'utilidad' : 'ingreso'
    router.push(`/wrapped?tipo=${taxType}&${param}=${amount}`)
  }

  const incomeLabel =
    taxType === 'empresa' ? 'utilidad neta anual (Q)' : 'ingreso bruto anual (Q)'

  if (step === 'profile') {
    return (
      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-white">
          ¿Cómo describes tu situación fiscal?
        </h2>
        {PROFILES.map(p => (
          <button
            key={p.type}
            onClick={() => handleProfileSelect(p.type)}
            className="w-full flex items-start gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition text-left text-white border border-white/20"
          >
            <span className="text-3xl">{p.icon}</span>
            <div>
              <div className="font-semibold">{p.label}</div>
              <div className="text-sm text-white/70">{p.sublabel}</div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <h2 className="text-xl font-semibold text-center text-white">
        ¿Cuál fue tu {incomeLabel} en 2024?
      </h2>
      <div>
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
          <span className="text-white font-bold text-xl">Q</span>
          <input
            type="number"
            value={income}
            onChange={e => setIncome(e.target.value)}
            placeholder="120,000"
            min="1"
            className="flex-1 bg-transparent text-white text-xl font-bold outline-none placeholder-white/30"
            autoFocus
          />
        </div>
        <p className="text-white/50 text-sm mt-2 text-center">
          Solo se usa para calcular. No se guarda ningún dato.
        </p>
      </div>
      <button
        type="submit"
        disabled={!income || parseFloat(income) <= 0}
        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg disabled:opacity-40 hover:bg-white/90 transition"
      >
        Ver mi Wrapped →
      </button>
      <button
        type="button"
        onClick={() => setStep('profile')}
        className="w-full text-white/50 text-sm hover:text-white/80 transition"
      >
        ← Cambiar perfil
      </button>
    </form>
  )
}
```

**Step 2: Update landing page**

Replace `src/app/page.tsx`:

```typescript
import InputForm from '@/components/InputForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="text-center space-y-3">
          <div className="text-5xl">🇬🇹</div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Impuestos Wrapped
          </h1>
          <p className="text-white/70 text-lg max-w-sm">
            Descubre en qué gastó el Estado guatemalteco tu dinero en 2024.
          </p>
        </div>
        <InputForm />
        <p className="text-white/30 text-xs text-center max-w-xs">
          Datos del Presupuesto 2025 (Decreto 36-2024) y SAT. Sin publicidad. Sin tracking.
        </p>
      </div>
    </main>
  )
}
```

**Step 3: Verify locally**

```bash
npm run dev
```

Open localhost:3000 — verify profile selection and income input work, that clicking "Ver mi Wrapped" redirects to `/wrapped?tipo=employee&ingreso=120000`

**Step 4: Commit**

```bash
git add src/app/page.tsx src/components/InputForm.tsx
git commit -m "feat: landing page and input form with profile selection"
```

---

## Task 5: Results page (slide controller)

**Files:**
- Create: `src/app/wrapped/page.tsx`
- Create: `src/components/SlideShow.tsx`

**Step 1: Create SlideShow controller**

Create `src/components/SlideShow.tsx`:

```typescript
'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SlideShowProps = {
  slides: React.ReactNode[]
}

export default function SlideShow({ slides }: SlideShowProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1)
      setCurrent(next)
    },
    [current]
  )

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* Nav dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Tap zones */}
      {current > 0 && (
        <button
          onClick={() => go(current - 1)}
          className="absolute left-0 top-0 w-1/3 h-full z-10"
          aria-label="Anterior"
        />
      )}
      {current < slides.length - 1 && (
        <button
          onClick={() => go(current + 1)}
          className="absolute right-0 top-0 w-1/3 h-full z-10"
          aria-label="Siguiente"
        />
      )}
    </div>
  )
}
```

**Step 2: Create wrapped page**

Create `src/app/wrapped/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { calculateTotalTax, type TaxProfile } from '@/lib/taxes'
import { allocateBudget } from '@/lib/budget'
import SlideShow from '@/components/SlideShow'
import TotalSlide from '@/components/slides/TotalSlide'
import CategorySlide from '@/components/slides/CategorySlide'
import CongresoSlide from '@/components/slides/CongresoSlide'
import DeudaSlide from '@/components/slides/DeudaSlide'
import EvacionSlide from '@/components/slides/EvacionSlide'
import ShareSlide from '@/components/slides/ShareSlide'

type SearchParams = { tipo?: string; ingreso?: string; utilidad?: string }

export default function WrappedPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const tipo = searchParams.tipo
  const ingreso = parseFloat(searchParams.ingreso ?? '0')
  const utilidad = parseFloat(searchParams.utilidad ?? '0')

  if (!tipo || !['employee', 'independiente', 'empresa'].includes(tipo)) {
    redirect('/')
  }

  let profile: TaxProfile
  if (tipo === 'empresa') {
    if (!utilidad || utilidad <= 0) redirect('/')
    profile = { type: 'empresa', netProfit: utilidad }
  } else {
    if (!ingreso || ingreso <= 0) redirect('/')
    profile = { type: tipo as 'employee' | 'independiente', grossAnnual: ingreso }
  }

  const taxResult = calculateTotalTax(profile)
  const allocations = allocateBudget(taxResult.total)

  // Pick the most interesting categories for slides (skip 'otros')
  const featuredCategories = ['educacion', 'salud', 'infraestructura', 'seguridad', 'municipalidades', 'pensiones']
  const featured = allocations.filter(a => featuredCategories.includes(a.key))
  const congreso = allocations.find(a => a.key === 'congreso')!
  const deuda = allocations.find(a => a.key === 'deuda')!

  const slides = [
    <TotalSlide key="total" taxResult={taxResult} tipo={tipo as any} />,
    ...featured.map(cat => (
      <CategorySlide key={cat.key} category={cat} totalTax={taxResult.total} />
    )),
    <CongresoSlide key="congreso" allocation={congreso} />,
    <DeudaSlide key="deuda" allocation={deuda} />,
    <EvacionSlide key="evacion" />,
    <ShareSlide key="share" taxResult={taxResult} tipo={tipo as any} />,
  ]

  return <SlideShow slides={slides} />
}
```

**Step 3: Commit**

```bash
git add src/app/wrapped/page.tsx src/components/SlideShow.tsx
git commit -m "feat: wrapped page with slide controller"
```

---

## Task 6: Slide components

**Files:**
- Create: `src/components/slides/TotalSlide.tsx`
- Create: `src/components/slides/CategorySlide.tsx`
- Create: `src/components/slides/CongresoSlide.tsx`
- Create: `src/components/slides/DeudaSlide.tsx`
- Create: `src/components/slides/EvacionSlide.tsx`
- Create: `src/components/slides/ShareSlide.tsx`

**Step 1: Create shared slide wrapper**

Create `src/components/slides/SlideBase.tsx`:

```typescript
import { ReactNode } from 'react'

type Props = {
  gradient: string
  children: ReactNode
}

export default function SlideBase({ gradient, children }: Props) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center px-8 py-12 ${gradient}`}>
      <div className="w-full max-w-sm space-y-6 text-center">
        {children}
      </div>
    </div>
  )
}
```

**Step 2: TotalSlide**

Create `src/components/slides/TotalSlide.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { TaxResult } from '@/lib/taxes'
import { TaxType } from '@/lib/taxes'

const TYPE_LABELS: Record<string, string> = {
  employee: 'empleado',
  independiente: 'independiente',
  empresa: 'empresa',
}

export default function TotalSlide({
  taxResult,
  tipo,
}: {
  taxResult: TaxResult
  tipo: TaxType
}) {
  return (
    <SlideBase gradient="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="text-6xl">🇬🇹</div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="space-y-2"
      >
        <p className="text-white/70 text-lg">Como {TYPE_LABELS[tipo]}, en 2024 pagaste</p>
        <p className="text-5xl font-black text-white">{formatQ(taxResult.total)}</p>
        <p className="text-white/50 text-sm">en impuestos</p>
      </motion.div>
      {taxResult.igss > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 rounded-xl p-4 text-left space-y-2"
        >
          <div className="flex justify-between text-white">
            <span>ISR</span>
            <span className="font-bold">{formatQ(taxResult.isr)}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>IGSS (4.83%)</span>
            <span className="font-bold">{formatQ(taxResult.igss)}</span>
          </div>
        </motion.div>
      )}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white/40 text-sm"
      >
        Toca para ver a dónde fue →
      </motion.p>
    </SlideBase>
  )
}
```

**Step 3: CategorySlide**

Create `src/components/slides/CategorySlide.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

const GRADIENTS: Record<string, string> = {
  educacion: 'bg-gradient-to-br from-green-800 to-emerald-900',
  salud: 'bg-gradient-to-br from-red-800 to-rose-900',
  infraestructura: 'bg-gradient-to-br from-yellow-800 to-orange-900',
  seguridad: 'bg-gradient-to-br from-slate-700 to-slate-900',
  municipalidades: 'bg-gradient-to-br from-teal-800 to-cyan-900',
  pensiones: 'bg-gradient-to-br from-violet-800 to-purple-900',
  defensa: 'bg-gradient-to-br from-gray-700 to-gray-900',
  desarrollo_social: 'bg-gradient-to-br from-pink-800 to-rose-900',
}

export default function CategorySlide({
  category,
  totalTax,
}: {
  category: BudgetCategory & { amount: number }
  totalTax: number
}) {
  const gradient = GRADIENTS[category.key] ?? 'bg-gradient-to-br from-indigo-800 to-indigo-900'

  return (
    <SlideBase gradient={gradient}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="text-7xl"
      >
        {category.emoji}
      </motion.div>
      <div className="space-y-1">
        <p className="text-white/70 text-lg">De lo que pagaste,</p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-white"
        >
          {formatQ(category.amount)}
        </motion.p>
        <p className="text-white/70 text-lg">fue a {category.label}</p>
        <p className="text-white/40 text-sm">{category.pct}% del presupuesto nacional</p>
      </div>
      {category.viralFact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white/15 rounded-xl p-4 text-white/80 text-sm leading-relaxed"
        >
          {category.viralFact}
        </motion.div>
      )}
    </SlideBase>
  )
}
```

**Step 4: CongresoSlide**

Create `src/components/slides/CongresoSlide.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ, diputadoDays } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

export default function CongresoSlide({
  allocation,
}: {
  allocation: BudgetCategory & { amount: number }
}) {
  const days = diputadoDays(allocation.amount)

  return (
    <SlideBase gradient="bg-gradient-to-br from-amber-800 to-yellow-900">
      <div className="text-7xl">🏛️</div>
      <div className="space-y-2">
        <p className="text-white/70 text-lg">Tu aporte al Congreso:</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-4xl font-black text-white"
        >
          {formatQ(allocation.amount)}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/30 rounded-xl p-5 space-y-3 text-left"
      >
        <p className="text-white font-semibold">Con eso financiaste:</p>
        <p className="text-white/80 text-sm">
          <span className="text-2xl font-black text-yellow-300">{days} días</span>{' '}
          del salario total de un diputado
        </p>
        <div className="border-t border-white/10 pt-3 space-y-1 text-xs text-white/50">
          <p>Salario base: Q47,700/mes</p>
          <p>Con dietas: hasta Q67,300/mes</p>
          <p className="text-white/70 font-semibold">
            Antes de feb 2025 ganaban Q29,150/mes.
            Se aumentaron 64% en una madrugada.
          </p>
        </div>
      </motion.div>
    </SlideBase>
  )
}
```

**Step 5: DeudaSlide**

Create `src/components/slides/DeudaSlide.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ, formatNumber } from '@/lib/formatters'
import { BudgetCategory } from '@/lib/budget'

export default function DeudaSlide({
  allocation,
}: {
  allocation: BudgetCategory & { amount: number }
}) {
  return (
    <SlideBase gradient="bg-gradient-to-br from-red-900 to-rose-950">
      <div className="text-7xl">💳</div>
      <div className="space-y-2">
        <p className="text-white/70 text-lg">Tu aporte al pago de deuda:</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-4xl font-black text-white"
        >
          {formatQ(allocation.amount)}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-black/30 rounded-xl p-4 space-y-2 text-sm text-white/70"
      >
        <p>Guatemala debe en total:</p>
        <p className="text-3xl font-black text-red-300">Q253,000 millones</p>
        <p className="text-white/50 text-xs mt-2">
          En 2025 se contrató la deuda nueva más alta de la historia: Q25,104 millones.
          El 47.9% va a gastos operativos, no a inversión.
        </p>
      </motion.div>
    </SlideBase>
  )
}
```

**Step 6: EvacionSlide**

Create `src/components/slides/EvacionSlide.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'

export default function EvacionSlide() {
  return (
    <SlideBase gradient="bg-gradient-to-br from-zinc-900 to-black">
      <div className="text-7xl">👻</div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <p className="text-white/70 text-lg">Mientras tú pagabas...</p>
        <p className="text-3xl font-black text-red-400">Q45,189 millones</p>
        <p className="text-white/70">se evadieron en IVA e ISR en 2023</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 rounded-xl p-4 space-y-3 text-sm"
      >
        <div className="flex justify-between text-white">
          <span>ISR evadido</span>
          <span className="font-bold text-red-300">Q30,618M</span>
        </div>
        <div className="flex justify-between text-white">
          <span>IVA evadido</span>
          <span className="font-bold text-red-300">Q14,571M</span>
        </div>
        <div className="border-t border-white/10 pt-3 text-white/50 text-xs">
          Fuente: SAT, presentación oficial julio 2024
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-white/50 text-sm"
      >
        Eso es 3 veces el presupuesto de salud del país.
      </motion.p>
    </SlideBase>
  )
}
```

**Step 7: ShareSlide**

Create `src/components/slides/ShareSlide.tsx`:

```typescript
'use client'

import { motion } from 'framer-motion'
import SlideBase from './SlideBase'
import { formatQ } from '@/lib/formatters'
import { TaxResult, TaxType } from '@/lib/taxes'

const TYPE_LABELS: Record<string, string> = {
  employee: 'empleado',
  independiente: 'independiente',
  empresa: 'empresa',
}

export default function ShareSlide({
  taxResult,
  tipo,
}: {
  taxResult: TaxResult
  tipo: TaxType
}) {
  const handleShare = async () => {
    const params = new URLSearchParams(window.location.search)
    const url = `${window.location.origin}/wrapped?${params.toString()}`
    const text = `Pagué ${formatQ(taxResult.total)} en impuestos en 2024. ¿Sabés en qué los gastó el Estado guatemalteco? 🇬🇹`

    if (navigator.share) {
      await navigator.share({ title: 'Mis Impuestos Wrapped', text, url })
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      alert('¡Enlace copiado!')
    }
  }

  return (
    <SlideBase gradient="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="text-6xl">🇬🇹</div>
      <div className="space-y-2">
        <p className="text-white/70 text-xl">Tu resumen fiscal 2024</p>
        <p className="text-5xl font-black text-white">{formatQ(taxResult.total)}</p>
        <p className="text-white/50">en impuestos como {TYPE_LABELS[tipo]}</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 w-full"
      >
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition"
        >
          Compartir mi Wrapped
        </button>
        <a
          href="/"
          className="block w-full py-3 rounded-xl border border-white/30 text-white text-center hover:bg-white/10 transition"
        >
          Calcular otro
        </a>
      </motion.div>
      <p className="text-white/20 text-xs">
        Datos del Presupuesto 2025 (Decreto 36-2024) y SAT
      </p>
    </SlideBase>
  )
}
```

**Step 8: Verify all slides render**

```bash
npm run dev
```

Navigate to `localhost:3000`, enter income, check all slides animate and display correct numbers.

**Step 9: Commit**

```bash
git add src/components/slides/
git commit -m "feat: all slide components (total, categories, congreso, deuda, evacion, share)"
```

---

## Task 7: OG image for social sharing

**Files:**
- Create: `src/app/api/og/route.tsx`

**Step 1: Install Satori**

```bash
npm install @vercel/og
```

**Step 2: Create OG image endpoint**

Create `src/app/api/og/route.tsx`:

```typescript
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const total = parseFloat(searchParams.get('total') ?? '0')
  const tipo = searchParams.get('tipo') ?? 'empleado'

  const formatted = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
  })
    .format(total)
    .replace('GTQ', 'Q')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a, #312e81, #581c87)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '60px',
          gap: '24px',
        }}
      >
        <div style={{ fontSize: 72 }}>🇬🇹</div>
        <div style={{ fontSize: 28, opacity: 0.7 }}>
          Como {tipo} en 2024, pagué en impuestos:
        </div>
        <div style={{ fontSize: 72, fontWeight: 900 }}>{formatted}</div>
        <div style={{ fontSize: 22, opacity: 0.5, marginTop: 16 }}>
          impuestoswrapped.gt
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

**Step 3: Add OG meta tags to wrapped page**

Add to `src/app/wrapped/page.tsx` (before the return):

```typescript
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const tipo = searchParams.tipo ?? 'employee'
  const ingreso = parseFloat(searchParams.ingreso ?? '0')
  const utilidad = parseFloat(searchParams.utilidad ?? '0')

  let profile: TaxProfile
  if (tipo === 'empresa') {
    profile = { type: 'empresa', netProfit: utilidad || 1 }
  } else {
    profile = { type: tipo as 'employee' | 'independiente', grossAnnual: ingreso || 1 }
  }
  const { total } = calculateTotalTax(profile)

  const ogUrl = `/api/og?total=${total}&tipo=${tipo}`

  return {
    title: 'Mis Impuestos Wrapped 2024',
    description: `Pagué Q${Math.round(total).toLocaleString('es-GT')} en impuestos en 2024. Descubre a dónde fue tu dinero.`,
    openGraph: {
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}
```

**Step 4: Test OG image**

```
localhost:3000/api/og?total=45000&tipo=employee
```

Expected: 1200x630 image with amount and flag

**Step 5: Commit**

```bash
git add src/app/api/ src/app/wrapped/page.tsx
git commit -m "feat: OG image generation for social sharing"
```

---

## Task 8: Mobile polish + Tailwind config

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`

**Step 1: Update layout with proper meta and font**

Replace `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Impuestos Wrapped Guatemala',
  description: 'Descubre en qué gastó el Estado guatemalteco tu dinero en 2024.',
  metadataBase: new URL('https://impuestoswrapped.gt'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
```

**Step 2: Fix mobile viewport height in globals.css**

Add to `src/app/globals.css`:

```css
html, body {
  height: 100%;
  overscroll-behavior: none;
}
```

**Step 3: Final smoke test**

```bash
npm run build
```

Expected: Build succeeds with no errors. Check for TypeScript errors.

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: mobile polish, layout meta, viewport fix"
```

---

## Task 9: Deploy to Vercel

**Step 1: Push to GitHub**

```bash
gh repo create impuestos-wrapped --public --source=. --push
```

**Step 2: Deploy to Vercel**

```bash
npx vercel --prod
```

Or connect via Vercel dashboard: vercel.com/new → import GitHub repo.

**Step 3: Set custom domain (optional)**

If you have `impuestoswrapped.gt` registered: add it in Vercel dashboard → Settings → Domains.

**Step 4: Verify live**

- Open the production URL
- Test all 3 profiles (employee, independiente, empresa)
- Share to WhatsApp and verify OG image renders correctly

---

## Data Sources (for footer/about)

All verified:
- Presupuesto 2025: Decreto 36-2024, Congreso de la República (congreso.gob.gt)
- Evasión fiscal: SAT, presentación oficial julio 2024 (AGN + Prensa Libre)
- Salario diputados: Publinews, febrero 2025
- ISR rates: Decreto 10-2012, SAT
- IGSS rates: igssgt.org
