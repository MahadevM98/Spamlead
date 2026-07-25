'use server'

import { createClient } from '@/utils/supabase/server'
import { GoogleGenAI } from '@google/genai'
import { revalidatePath } from 'next/cache'

export async function generateAIResponse(prompt: string) {
  if (!prompt || !prompt.trim()) {
    return { error: 'Prompt text cannot be empty.' }
  }

  // 1. Verify user authentication via Supabase server client
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized: You must be signed in to use Google Gemini AI.' }
  }

  try {
    // Auto-clean any accidental spaces, newlines, or quotation marks from Vercel dashboard pasting
    const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '')

    // 2. Initialize the @google/genai client
    const ai = new GoogleGenAI({ apiKey })

    // 3. Send the prompt to the gemini-2.5-flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    const responseText = response.text || 'No text returned from Gemini.'

    // 4. Insert a new row into the ai_interactions Supabase table
    const { error: insertError } = await supabase.from('ai_interactions').insert({
      user_id: user.id,
      prompt_text: prompt,
      gemini_response: responseText,
    })

    if (insertError) {
      console.error('Failed to log AI interaction to Supabase:', insertError.message)
    }

    // Trigger server-side revalidation of the dashboard so the new interaction appears instantly
    revalidatePath('/dashboard')

    // 5. Return the AI response text to the frontend
    return { response: responseText }
  } catch (err: any) {
    console.error('Error in generateAIResponse:', err)
    return { error: err.message || 'An error occurred while communicating with Google Gemini.' }
  }
}
