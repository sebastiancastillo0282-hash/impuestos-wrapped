import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const total = parseFloat(searchParams.get('total') ?? '0')
  const tipo = searchParams.get('tipo') ?? 'employee'

  const formatted = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
  }).format(total).replace('GTQ', 'Q')

  const TIPO_LABEL: Record<string, string> = {
    employee: 'EMPLEADO FORMAL',
    independiente: 'INDEPENDIENTE',
    empresa: 'EMPRESA',
  }

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#080808',
        padding: '64px 80px',
        justifyContent: 'space-between',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            color: '#F2EDE4',
            fontSize: 18,
            opacity: 0.3,
            letterSpacing: '0.2em',
            fontFamily: 'monospace',
            fontWeight: 500,
          }}>
            IMPUESTOS WRAPPED GT
          </span>
          <span style={{
            color: '#E8C547',
            fontSize: 16,
            opacity: 0.55,
            letterSpacing: '0.15em',
            fontFamily: 'monospace',
          }}>
            {TIPO_LABEL[tipo] ?? tipo.toUpperCase()} · 2024
          </span>
        </div>

        {/* Main number */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span style={{
            color: '#F2EDE4',
            fontSize: 22,
            opacity: 0.35,
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}>
            le diste al Estado:
          </span>
          <span style={{
            color: '#E8C547',
            fontSize: total >= 1000000 ? 108 : 128,
            fontWeight: 900,
            lineHeight: 0.88,
            fontFamily: 'sans-serif',
            letterSpacing: '-0.02em',
          }}>
            {formatted}
          </span>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{
            color: '#F2EDE4',
            fontSize: 17,
            opacity: 0.2,
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
          }}>
            ¿En qué se fue? Calculá el tuyo en:
          </span>
          <span style={{
            color: '#E8C547',
            fontSize: 20,
            opacity: 0.65,
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
          }}>
            impuestos.aceleraguate.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
