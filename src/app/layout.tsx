import type { Metadata } from 'next'
import { Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-display',
})

const ibmMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Impuestos Wrapped Guatemala',
  description: '¿Cuánto le diste al Estado guatemalteco en 2024? Calculá tu parte.',
  metadataBase: new URL('https://impuestos.aceleraguate.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${barlow.variable} ${ibmMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
