import { ReactNode } from 'react'

type Props = {
  gradient: string
  children: ReactNode
}

export default function SlideBase({ gradient, children }: Props) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center px-8 py-12 ${gradient}`}>
      <div className="w-full max-w-sm space-y-6 text-center">
        {children}
      </div>
    </div>
  )
}
