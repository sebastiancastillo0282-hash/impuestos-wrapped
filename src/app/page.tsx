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
