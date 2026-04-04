import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAILZEET_API_KEY = process.env.MAILZEET_API_KEY!
const MAILZEET_API_URL = 'https://api.mailzeet.com/v1/mails'
const SENDER_EMAIL = 'contact.reasy@gmail.com'
const SENDER_NAME = 'Reasy'
const ADMIN_EMAIL = 'contact.reasy@gmail.com'

// IDs des templates Mailzeet
const TEMPLATE_CONFIRMATION = 'bl03q8nts730'  // Email envoyé à l'inscrit
const TEMPLATE_ADMIN        = 'ql74zjf1c40w'  // Email envoyé à l'admin

async function sendEmail(payload: Record<string, unknown>) {
  try {
    const res = await fetch(MAILZEET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MAILZEET_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) console.error('Mailzeet error:', data)
    return data
  } catch (err) {
    console.error('Mailzeet fetch error:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email } = body

    // Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis.' },
        { status: 400 }
      )
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Adresse email invalide.' },
        { status: 400 }
      )
    }

    // Insert dans Supabase
    const { error } = await supabase.from('waitlist').insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.toLowerCase().trim(),
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "Cet email est déjà inscrit sur la liste d'attente." },
          { status: 409 }
        )
      }
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { message: 'Une erreur est survenue. Réessayez.' },
        { status: 500 }
      )
    }

    // Position dans la liste
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    const position = count ?? 1

    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    })

    // Envoi des deux emails en parallèle via templates Mailzeet
    await Promise.allSettled([

      // 1. Confirmation à l'inscrit — seulement {{first_name}}
      sendEmail({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        recipients: [{ email: email.toLowerCase().trim(), name: `${firstName.trim()} ${lastName.trim()}` }],
        template_id: TEMPLATE_CONFIRMATION,
        params: {
          last_name: firstName.trim(),
        },
      }),

      // 2. Notification admin — {{first_name}}, {{last_name}}, {{email}}, {{position}}, {{date}}
      sendEmail({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        recipients: [{ email: ADMIN_EMAIL, name: 'Reasy Admin' }],
        template_id: TEMPLATE_ADMIN,
        params: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          position: String(position),
          email: email.toLowerCase().trim(),
          date,
        },
      }),
    ])

    return NextResponse.json(
      { message: 'Inscription réussie !', position },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { message: 'Une erreur serveur est survenue.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
  return NextResponse.json({ count: count ?? 0 })
}