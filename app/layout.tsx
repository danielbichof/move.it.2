import type { Metadata } from 'next'
import { Inter, Rajdhani } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
})

const rajdhani = Rajdhani({
  variable: '--font-rajdhani',
  subsets: ['latin'],
  weight: ['500', '600', '700']
})

export const metadata: Metadata = {
  title: {
    default: 'Move.it',
    template: '%s | move.it'
  },
  description: 'Aplicação para melhorar sua produtividade com a técnica Pomodoro'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${inter.variable} ${rajdhani.variable} antialiased`}>{children}</body>
    </html>
  )
}
