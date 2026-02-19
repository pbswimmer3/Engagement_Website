import type { Metadata } from 'next'
import { Cormorant_Garamond, Great_Vibes, Lato } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: "Prad & Aanya — Engagement",
  description: "Join us to celebrate the engagement of Prad and Aanya.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${lato.variable}`}
    >
      <body className="bg-cream font-sans text-dark min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
