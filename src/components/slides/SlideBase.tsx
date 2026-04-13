import { ReactNode } from 'react'

type Props = {
  bg?: string
  accentColor?: string
  question?: string
  children: ReactNode
}

export default function SlideBase({ bg = '#080808', accentColor, question, children }: Props) {
  return (
    <div
      className="relative w-full h-full flex flex-col grain overflow-hidden"
      style={{ background: bg }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(#F2EDE4 1px, transparent 1px), linear-gradient(90deg, #F2EDE4 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Accent glow */}
      {accentColor && (
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none" style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }} />
      )}

      <div className="relative z-10 flex-1 flex flex-col px-8 py-12 max-w-lg mx-auto w-full pb-4">
        {children}
      </div>

      {/* Per-rubro question */}
      {question && (
        <div
          className="relative z-10 px-8 pb-10 max-w-lg mx-auto w-full"
          style={{ borderTop: '1px solid rgba(242,237,228,0.08)' }}
        >
          <p
            className="text-xs leading-relaxed pt-3"
            style={{
              color: accentColor ?? '#F2EDE4',
              opacity: 0.6,
              fontFamily: 'var(--font-dm-sans)',
              fontStyle: 'italic',
            }}
          >
            {question}
          </p>
        </div>
      )}
    </div>
  )
}
