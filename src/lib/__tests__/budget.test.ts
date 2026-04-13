import { describe, it, expect } from 'vitest'
import { allocateBudget, BUDGET_CATEGORIES } from '../budget'

describe('allocateBudget', () => {
  it('allocates tax paid proportionally across categories', () => {
    const alloc = allocateBudget(10000)
    const educ = alloc.find(a => a.key === 'educacion')!
    // 17.27% of Q10,000 = Q1,727
    expect(educ.amount).toBeCloseTo(1727, 0)
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
