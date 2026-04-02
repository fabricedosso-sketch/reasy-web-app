import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: 'Inscription confirmée — Reasy',
}

export default function MerciPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>🎉</div>
        <h1 className={styles.title}>Vous êtes sur la liste !</h1>
        <p className={styles.text}>
          Merci de votre intérêt pour Reasy. Vous serez parmi les premiers à être notifié
          lors du lancement et à bénéficier de toutes nos fonctionnalités.
        </p>
        <Link href="/" className={styles.btn}>
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}