import InputForm from '@/components/InputForm'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden grain" style={{ background: 'var(--black)' }}>
      {/* Faint grid lines — editorial texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(var(--white) 1px, transparent 1px), linear-gradient(90deg, var(--white) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 pt-8 pb-0 flex items-center justify-between">
          <span className="font-display text-sm tracking-widest opacity-40" style={{ color: 'var(--white)' }}>
            ACELERAGUATE.COM
          </span>
          <span className="text-xs opacity-30" style={{ color: 'var(--white)', fontFamily: 'var(--font-dm-sans)' }}>
            DATOS: DECRETO 36-2024
          </span>
        </header>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-12">
          <div className="w-full max-w-md">
            {/* Eyebrow */}
            <p className="text-xs tracking-[0.3em] mb-4 opacity-50" style={{ color: 'var(--yellow)', fontFamily: 'var(--font-dm-sans)' }}>
              PRESUPUESTO NACIONAL 2025 · Q148,526 MILLONES
            </p>

            {/* Headline */}
            <h1 className="font-display leading-none mb-6" style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', color: 'var(--white)' }}>
              ¿CUÁNTO<br />
              PUSISTE<br />
              <span style={{ color: 'var(--yellow)' }}>VOS?</span>
            </h1>

            {/* Subline */}
            <p className="text-base mb-10 leading-relaxed max-w-xs" style={{ color: 'var(--white)', opacity: 0.55, fontFamily: 'var(--font-dm-sans)' }}>
              Calculá tu aporte al presupuesto nacional y mirá slide por slide en qué se fue.
              Spoiler: no te vas a alegrar.
            </p>

            <InputForm />
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 text-center">
          <p className="text-xs opacity-20" style={{ color: 'var(--white)' }}>
            Sin publicidad · Sin tracking · Código fuente público
          </p>
        </footer>
      </div>
    </main>
  )
}
