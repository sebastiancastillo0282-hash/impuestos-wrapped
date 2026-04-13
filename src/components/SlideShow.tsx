'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SlideShowProps = {
  slides: React.ReactNode[]
}

export default function SlideShow({ slides }: SlideShowProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1)
      setCurrent(next)
    },
    [current]
  )

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
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

      {/* Nav dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Tap zones */}
      {current > 0 && (
        <button
          onClick={() => go(current - 1)}
          className="absolute left-0 top-0 w-1/3 h-full z-10"
          aria-label="Anterior"
        />
      )}
      {current < slides.length - 1 && (
        <button
          onClick={() => go(current + 1)}
          className="absolute right-0 top-0 w-1/3 h-full z-10"
          aria-label="Siguiente"
        />
      )}
    </div>
  )
}
