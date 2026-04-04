import Link from 'next/link'
import Logo from '@/components/Logo'
import DashboardMockup from '@/components/DashboardMockup'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.page}>

      {/* Fixed navbar */}
      <div className={styles.navWrapper}>
        <nav className={styles.nav}>
          <Logo href="/" size="md" />
        </nav>
      </div>

      {/* Spacer below fixed nav */}
      <div className={styles.navSpacer} />

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.headline}>
          Une nouvelle façon{' '}
          <span className={styles.accent}>de gérer</span>
          <br />
          vos biens locatifs arrive
        </h1>
        <p className={styles.subheadline}>
          Fini le chaos entre WhatsApp, appels et réservations perdues.{' '}
          Reasy centralise, automatise et simplifie la gestion de tous vos beins locatifs.
        </p>
        <Link href="/waitlist" className={styles.cta}>
          Réjoindre la liste d&apos;attente
        </Link>
      </section>

      {/* Dashboard preview */}
      <section className={styles.preview}>
        <DashboardMockup />
      </section>

    </main>
  )
}