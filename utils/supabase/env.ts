export function getSupabaseEnv() {
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '')
  let key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/^["']|["']$/g, '')

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

  return { url, key }
}
