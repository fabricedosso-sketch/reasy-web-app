import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    // Check for duplicate
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      return NextResponse.json(
        { message: "Cet email est déjà inscrit sur la liste d'attente." },
        { status: 409 }
      )
    }

    // Insert new entry
    const { error } = await supabase.from('waitlist').insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.toLowerCase().trim(),
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { message: 'Une erreur est survenue. Réessayez.' },
        { status: 500 }
      )
    }

    // Get total count for position
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json(
      { message: 'Inscription réussie !', position: count },
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