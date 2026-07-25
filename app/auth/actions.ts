'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }
  } catch (err: any) {
    console.error('Unhandled exception in login action:', err)
    return { error: err.message || 'An unexpected error occurred during login.' }
  }

  // IMPORTANT: redirect() must be called outside try/catch blocks in Next.js App Router
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }
  } catch (err: any) {
    console.error('Unhandled exception in signup action:', err)
    return { error: err.message || 'An unexpected error occurred during sign up.' }
  }

  // IMPORTANT: redirect() must be called outside try/catch blocks in Next.js App Router
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Unhandled exception in signout action:', err)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
