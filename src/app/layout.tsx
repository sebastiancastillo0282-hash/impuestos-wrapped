import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Impuestos Wrapped Guatemala',
  description: 'Descubre en qué gastó el Estado guatemalteco tu dinero en 2024.',
  metadataBase: new URL('https://impuestoswrapped.gt'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>{children}</body>
    </html>
  )
}
