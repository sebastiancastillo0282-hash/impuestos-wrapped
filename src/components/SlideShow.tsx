'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SlideShowProps = {
  slides: React.ReactNode[]
}

export default function SlideShow({ slides }: SlideShowProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1)
      setCurrent(next)
    },
    [current]
  )

  const prev = () => current > 0 && go(current - 1)
  const next = () => current < slides.length - 1 && go(current + 1)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchStartY.current = e.targetTouches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    // Only trigger if horizontal swipe is dominant and long enough
    if (Math.abs(dx) > 48 && Math.abs(dx) > dy * 1.5) {
      if (dx > 0) next(); else prev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          {slides[current]}
        </motion.div>
      </AnimatePresence>

      {/* Counter */}
      <div
        className="absolute top-5 right-6 z-20 select-none font-mono"
        style={{ letterSpacing: '0.08em' }}
      >
        <span style={{ color: '#F2EDE4', fontSize: '1.1rem', opacity: 0.9 }}>
          {pad(current + 1)}
        </span>
        <span style={{ color: '#F2EDE4', fontSize: '1.1rem', opacity: 0.25 }}>
          /{pad(slides.length)}
        </span>
      </div>

      {/* Arrow — left */}
      {current > 0 && (
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-0 top-0 h-full z-10 flex items-center justify-start group"
          style={{ width: '20%', background: 'transparent' }}
        >
          <div
            className="ml-3 flex items-center justify-center transition-all duration-200 group-hover:opacity-100"
            style={{
              width: 36,
              height: 36,
              borderRadius: 2,
              border: '1px solid rgba(242,237,228,0.15)',
              background: 'rgba(8,8,8,0.6)',
              opacity: 0.45,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="#F2EDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      )}

      {/* Arrow — right */}
      {current < slides.length - 1 && (
        <button
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-0 top-0 h-full z-10 flex items-center justify-end group"
          style={{ width: '20%', background: 'transparent' }}
        >
          <div
            className="mr-3 flex items-center justify-center transition-all duration-200 group-hover:opacity-100"
            style={{
              width: 36,
              height: 36,
              borderRadius: 2,
              border: '1px solid rgba(242,237,228,0.15)',
              background: 'rgba(8,8,8,0.6)',
              opacity: 0.45,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="#F2EDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px]" style={{ background: 'rgba(242,237,228,0.08)' }}>
        <motion.div
          className="h-full"
          style={{ background: '#E8C547' }}
          animate={{ width: `${((current + 1) / slides.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  )
}
