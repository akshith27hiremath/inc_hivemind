import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const inter = localFont({
  src: [
    {
      path: '../fonts/inter-latin.woff2',
      style: 'normal',
    },
    {
      path: '../fonts/inter-latin-ext.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  weight: '300 900',
})

const jetbrainsMono = localFont({
  src: [
    {
      path: '../fonts/jetbrains-mono-latin.woff2',
      style: 'normal',
    },
    {
      path: '../fonts/jetbrains-mono-latin-ext.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  weight: '400 700',
})

const instrumentSerif = localFont({
  src: [
    {
      path: '../fonts/instrument-serif-latin.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../fonts/instrument-serif-italic-latin.woff2',
      style: 'italic',
      weight: '400',
    },
  ],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hivemind — Portfolio Intelligence for the Individual Investor',
  description:
    'Hivemind maps the hidden relationships between your holdings and the world\'s financial events. See the connections Wall Street sees.',
  keywords: ['portfolio intelligence', 'investment', 'stock analysis', 'supply chain', 'financial insights'],
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
