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

// Format large numbers with commas
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-GT').format(Math.round(n))
}

// How many days of a diputado's salary (Q67,300/month = Q2,243/day)
// Source: Publinews, febrero 2025
export function diputadoDays(amount: number): number {
  const DIPUTADO_DAILY = 67300 / 30
  return Math.round(amount / DIPUTADO_DAILY)
}

// How many vaccines (estimated cost Q85 each, MSPAS data)
export function vaccineCount(healthAmount: number): number {
  return Math.round(healthAmount / 85)
}
