import Link from 'next/link'
import styles from './Logo.module.css'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ href = '/', size = 'md' }: LogoProps) {
  const content = (
    <div className={`${styles.logo} ${styles[size]}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-icon.png"
        alt="Reasy icon"
        className={styles.icon}
      />
      <span className={styles.text}>Reasy</span>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}