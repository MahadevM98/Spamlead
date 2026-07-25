import { createBrowserClient } from '@supabase/ssr'

const cleanUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '')
const cleanKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/^["']|["']$/g, '')

export function createClient() {
  return createBrowserClient(cleanUrl, cleanKey)
}
