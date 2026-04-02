import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reasy — Accès anticipé',
  description: 'Rejoignez la liste d\'attente Reasy et soyez parmi les premiers à simplifier votre gestion locative.',
  openGraph: {
    title: 'Reasy — Une nouvelle façon de gérer vos locations',
    description: 'Fini le chaos entre WhatsApp, appels et réservations perdues. Reasy centralise, automatise et simplifie toute votre gestion locative.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  )
}