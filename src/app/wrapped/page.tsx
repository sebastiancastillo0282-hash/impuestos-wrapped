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

import type { Metadata } from 'next'

type SearchParams = { tipo?: string; ingreso?: string; utilidad?: string }

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const params = await searchParams
  const tipo = params.tipo ?? 'empleado'
  const ingreso = parseFloat(params.ingreso ?? '0')
  const utilidad = parseFloat(params.utilidad ?? '0')

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

export default async function WrappedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const tipo = params.tipo
  const ingreso = parseFloat(params.ingreso ?? '0')
  const utilidad = parseFloat(params.utilidad ?? '0')

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

  // Ordered — justicia and otros replace municipalidades and pensiones
  const featuredCategories = ['educacion', 'salud', 'infraestructura', 'seguridad', 'justicia', 'otros']
  const featured = featuredCategories
    .map(key => allocations.find(a => a.key === key))
    .filter(Boolean) as typeof allocations
  const congreso = allocations.find(a => a.key === 'congreso')!
  const deuda = allocations.find(a => a.key === 'deuda')!

  const t = tipo as 'employee' | 'independiente' | 'empresa'

  const slides = [
    <TotalSlide key="total" taxResult={taxResult} tipo={t} />,
    ...featured.map(cat => (
      <CategorySlide key={cat.key} category={cat} totalTax={taxResult.total} tipo={t} />
    )),
    <CongresoSlide key="congreso" allocation={congreso} tipo={t} />,
    <DeudaSlide key="deuda" allocation={deuda} tipo={t} />,
    <EvacionSlide key="evacion" tipo={t} />,
    <ShareSlide key="share" taxResult={taxResult} tipo={t} />,
  ]

  return <SlideShow slides={slides} />
}
