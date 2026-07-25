const FALLBACK_URL = 'https://ajemtlcalaxtcsrayjzd.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZW10bGNhbGF4dGNzcmF5anpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NTkzMDEsImV4cCI6MjEwMDUzNTMwMX0.P9ZAKQbW_eHkEQiLeftuAd1WunHhSYBLnKlb4HTuJm8'

export function getSupabaseEnv() {
  // If Vercel environment variables are missing or unchecked for Production, use safe project fallbacks
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL).trim().replace(/^["']|["']$/g, '')
  let key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY).trim().replace(/^["']|["']$/g, '')

  // 1. Strip variable name if user accidentally pasted "NEXT_PUBLIC_SUPABASE_URL=..." in Vercel value box
  if (url.includes('=')) {
    url = url.split('=').pop()?.trim() || url
  }
  if (key.includes('=')) {
    key = key.split('=').pop()?.trim() || key
  }

  // 2. Detect if user swapped URL and Anon Key in Vercel Dashboard and auto-correct
  if (url.startsWith('ey') && (key.includes('supabase.co') || key.startsWith('http'))) {
    console.warn('Notice: Supabase URL and Anon Key were swapped! Auto-correcting in memory.')
    const temp = url
    url = key
    key = temp
  }

  // 3. Ensure URL starts with https:// if protocol was omitted
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }

  // 4. Strip any trailing slashes from the URL
  url = url.replace(/\/+$/, '')

  // 5. CRITICAL GUARANTEE: Verify that url is a valid URL before Supabase sees it.
  // If whatever is in Vercel settings fails URL parsing, discard it and use the valid FALLBACK_URL.
  try {
    new URL(url)
  } catch {
    console.error(`Malformed Supabase URL detected in environment ("${url}"). Discarding and using valid fallback URL!`)
    url = FALLBACK_URL
  }

  if (!key || key.length < 20) {
    console.error('Malformed or missing Supabase Key in environment. Discarding and using valid fallback key!')
    key = FALLBACK_KEY
  }

  return { url, key }
}
