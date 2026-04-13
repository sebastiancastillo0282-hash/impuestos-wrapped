import InputForm from '@/components/InputForm'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden grain" style={{ background: 'var(--black)' }}>
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="px-6 pt-7 pb-0 flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.2em]" style={{ color: 'var(--white)', opacity: 0.3 }}>
            ACELERAGUATE.COM
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--white)', opacity: 0.2 }}>
            DECRETO 36-2024
          </span>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-12">
          <div className="w-full max-w-md">
            <p className="font-mono text-xs tracking-[0.25em] mb-5" style={{ color: 'var(--yellow)', opacity: 0.6 }}>
              PRESUPUESTO NACIONAL 2025 · Q148,526M
            </p>

            <h1 className="font-display leading-none mb-6" style={{ fontSize: 'clamp(4.5rem, 17vw, 7.5rem)', color: 'var(--white)' }}>
              ¿CUÁNTO<br />
              PUSISTE<br />
              <span style={{ color: 'var(--yellow)' }}>VOS?</span>
            </h1>

            <p className="font-mono text-sm mb-10 leading-relaxed max-w-xs" style={{ color: 'var(--white)', opacity: 0.45 }}>
              Calculá tu aporte al presupuesto nacional y mirá slide por slide en qué se fue. Spoiler: no te vas a alegrar.
            </p>

            <InputForm />
          </div>
        </div>

        <footer className="px-6 py-4 text-center">
          <p className="font-mono text-xs" style={{ color: 'var(--white)', opacity: 0.15 }}>
            Sin publicidad · Sin tracking · Código fuente público
          </p>
        </footer>
      </div>
    </main>
  )
}
