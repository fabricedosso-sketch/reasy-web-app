'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './WaitlistForm.module.css'

export default function WaitlistForm() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Adresse email invalide.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/merci')
      } else {
        setError(data.message || 'Une erreur est survenue.')
      }
    } catch {
      setError('Impossible de rejoindre la liste. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.nameRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lastName">Nom</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Entrer votre nom"
            className={styles.input}
            value={form.lastName}
            onChange={handleChange}
            autoComplete="family-name"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="firstName">Prénom</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Entrer votre prénom"
            className={styles.input}
            value={form.firstName}
            onChange={handleChange}
            autoComplete="given-name"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Entrer votre adresse Email"
          className={styles.input}
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
      >
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          "Rejoindre la liste d'attente"
        )}
      </button>
    </form>
  )
}