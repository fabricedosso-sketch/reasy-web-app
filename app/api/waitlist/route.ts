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

async function sendEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string
  toName: string
  subject: string
  html: string
}) {
  try {
    const res = await fetch(MAILZEET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MAILZEET_API_KEY}`,
      },
      body: JSON.stringify({
        sender: {
          email: SENDER_EMAIL,
          name: SENDER_NAME,
        },
        recipients: [{ email: to, name: toName }],
        subject,
        html,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('Mailzeet error:', data)
    }
    return data
  } catch (err) {
    console.error('Mailzeet fetch error:', err)
  }
}

// Email de notification à l'admin
function buildAdminEmail(firstName: string, lastName: string, email: string, position: number) {
  return `
    <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: #1aaa8a; padding: 28px 32px;">
        <h1 style="margin: 0; color: white; font-size: 20px; font-weight: 700;">🎉 Nouvelle inscription Reasy</h1>
      </div>
      <div style="padding: 32px;">
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Inscrit n°<strong style="color: #1aaa8a;">${position}</strong> sur la liste d'attente</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 12px 16px; background: #f9fafb; border-radius: 8px 8px 0 0; border-bottom: 1px solid #e5e7eb;">
              <span style="font-size: 12px; color: #9ca3af; display: block; margin-bottom: 2px;">Nom complet</span>
              <span style="font-size: 15px; color: #1a1a2e; font-weight: 600;">${firstName} ${lastName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; background: #f9fafb; border-radius: 0 0 8px 8px;">
              <span style="font-size: 12px; color: #9ca3af; display: block; margin-bottom: 2px;">Email</span>
              <span style="font-size: 15px; color: #1aaa8a; font-weight: 600;">${email}</span>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  `
}

// Email de confirmation à l'inscrit
function buildConfirmationEmail(firstName: string, position: number) {
  return `
    <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: #1aaa8a; padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 800;">Reasy</h1>
        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">La gestion locative simplifiée</p>
      </div>
      <div style="padding: 36px 32px;">
        <h2 style="margin: 0 0 12px; color: #1a1a2e; font-size: 22px; font-weight: 700;">
          Vous êtes sur la liste ! 🎉
        </h2>
        <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.65;">
          Bonjour <strong>${firstName}</strong>,<br/><br/>
          Merci de votre intérêt pour Reasy ! Vous êtes la <strong style="color: #1aaa8a;">personne n°${position}</strong> à rejoindre notre liste d'attente.
        </p>
        <div style="background: #f0fdf8; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px;">
          <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
            ✅ Vous serez parmi les <strong>premiers notifiés</strong> au lancement<br/>
            ✅ Accès <strong>premium offert</strong> aux premiers inscrits<br/>
            ✅ Tarifs <strong>early adopter</strong> exclusifs
          </p>
        </div>
        <p style="margin: 0 0 28px; color: #6b7280; font-size: 14px; line-height: 1.6;">
          En attendant, si vous avez des questions ou des suggestions, n'hésitez pas à nous contacter directement à <a href="mailto:contact.reasy@gmail.com" style="color: #1aaa8a; font-weight: 600;">contact.reasy@gmail.com</a>.
        </p>
        <p style="margin: 32px 0 0; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px;">
          © ${new Date().getFullYear()} Reasy · Tous droits réservés
        </p>
      </div>
    </div>
  `
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

    // Récupère la position
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const position = count ?? 1

    // Envoi des deux emails en parallèle
    await Promise.allSettled([
      // Notification admin
      sendEmail({
        to: ADMIN_EMAIL,
        toName: 'Reasy Admin',
        subject: `🎉 Nouvelle inscription #${position} — ${firstName} ${lastName}`,
        html: buildAdminEmail(firstName.trim(), lastName.trim(), email.toLowerCase().trim(), position),
      }),
      // Confirmation à l'inscrit
      sendEmail({
        to: email.toLowerCase().trim(),
        toName: `${firstName.trim()} ${lastName.trim()}`,
        subject: "Vous êtes sur la liste d'attente Reasy ! 🎉",
        html: buildConfirmationEmail(firstName.trim(), position),
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