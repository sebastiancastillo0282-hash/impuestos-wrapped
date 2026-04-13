import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

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
