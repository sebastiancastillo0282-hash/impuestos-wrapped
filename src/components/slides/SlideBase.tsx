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
      {/* Accent glow — corner */}
      {accentColor && (
        <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 65%)`,
          transform: 'translate(25%, -25%)',
        }} />
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-7 pt-14 pb-4 max-w-lg mx-auto w-full">
        {children}
      </div>

      {/* Question — anchored to bottom */}
      {question && (
        <div className="relative z-10 px-7 pb-10 max-w-lg mx-auto w-full">
          <div style={{ height: 1, background: `${accentColor ?? '#F2EDE4'}22`, marginBottom: '1rem' }} />
          <p
            className="text-sm leading-relaxed font-mono"
            style={{
              color: accentColor ?? '#F2EDE4',
              opacity: 0.75,
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
