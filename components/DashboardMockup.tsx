'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './DashboardMockup.module.css'

export default function DashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 2
      const y = (e.clientY / innerHeight - 0.5) * 2
      setTransform({
        rotateX: -y * 6,
        rotateY: x * 8,
      })
    }

    const handleMouseLeave = () => {
      setTransform({ rotateX: 0, rotateY: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const perspectiveStyle = {
    transform: `
      perspective(1200px)
      rotateX(${transform.rotateX}deg)
      rotateY(${transform.rotateY}deg)
    `,
    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
  }

  return (
    <div className={styles.scene} ref={containerRef}>
      <div
        className={`${styles.card} ${mounted ? styles.visible : ''}`}
        style={perspectiveStyle}
      >
        {/* Dynamic glow */}
        <div
          className={styles.glow}
          style={{
            transform: `translate(${transform.rotateY * 2}px, ${-transform.rotateX * 2}px)`,
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        {/* Browser chrome */}
        <div className={styles.chrome}>
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
          <div className={styles.urlBar}>
            <span className={styles.lock}>🔒</span>
            <span>app.myreasy.com/dashboard</span>
          </div>
          <div className={styles.chromeRight}>
            <span>Mon espace ▾</span>
          </div>
        </div>

        {/* Dashboard image — native <img> pour éviter tout problème Next.js Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dashboard.png"
          alt="Aperçu du dashboard Reasy"
          className={styles.dashboardImg}
        />
      </div>
    </div>
  )
}