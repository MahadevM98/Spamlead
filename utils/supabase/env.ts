const FALLBACK_URL = 'https://ajemtlcalaxtcsrayjzd.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZW10bGNhbGF4dGNzcmF5anpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NTkzMDEsImV4cCI6MjEwMDUzNTMwMX0.P9ZAKQbW_eHkEQiLeftuAd1WunHhSYBLnKlb4HTuJm8'

export function getSupabaseEnv() {
  // 1. Strip ALL whitespace, tabs, and newlines from inside the strings (fixes copy-paste word wrapping)
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL).replace(/\s+/g, '').replace(/^["']|["']$/g, '')
  let key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY).replace(/\s+/g, '').replace(/^["']|["']$/g, '')

  // 2. Strip variable name if user accidentally pasted "NEXT_PUBLIC_SUPABASE_URL=..." in Vercel value box
  if (url.includes('=')) {
    url = url.split('=').pop() || url
  }
  if (key.includes('=')) {
    key = key.split('=').pop() || key
  }

  // 3. Detect if user swapped URL and Anon Key in Vercel Dashboard and auto-correct
  if (url.startsWith('ey') && (key.includes('supabase.co') || key.startsWith('http'))) {
    console.warn('Notice: Supabase URL and Anon Key were swapped! Auto-correcting in memory.')
    const temp = url
    url = key
    key = temp
  }

  // 4. If user pasted the key twice or concatenated tokens in Vercel, extract ONLY the first valid JWT (header.payload.signature)
  const keyParts = key.split('.')
  if (keyParts.length >= 3) {
    key = `${keyParts[0]}.${keyParts[1]}.${keyParts[2]}`
  }

  // 5. Ensure URL starts with https:// if protocol was omitted
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }

  // 6. Strip any trailing slashes from the URL
  url = url.replace(/\/+$/, '')

  // 7. CRITICAL GUARANTEE: Verify that url is a valid URL before Supabase sees it.
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
