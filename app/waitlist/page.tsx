import Logo from '@/components/Logo'
import DashboardMockup from '@/components/DashboardMockup'
import WaitlistForm from '@/components/WaitlistForm'
import styles from './page.module.css'

export const metadata = {
  title: "Reasy — Rejoindre la liste d'attente",
}

export default function WaitlistPage() {
  return (
    <div className={styles.layout}>
      {/* Left panel — Form */}
      <div className={styles.left}>
        <div className={styles.leftInner}>

          {/* Logo row */}
          <div className={styles.logoRow}>
            <Logo href="/" size="md" />
            <span className={styles.badge}>Coming soon</span>
          </div>

          {/* Heading */}
          <div className={styles.heading}>
            <h1 className={styles.title}>Obtenir un accès anticipé !</h1>
            <p className={styles.subtitle}>
              Soyez parmi les premiers à créer un profil et à obtenir un compte premium.
            </p>
          </div>

          {/* Form */}
          <WaitlistForm />
        </div>
      </div>

      {/* Right panel — Preview */}
      <div className={styles.right}>
        <div className={styles.rightInner}>
          <DashboardMockup />
        </div>
      </div>
    </div>
  )
}