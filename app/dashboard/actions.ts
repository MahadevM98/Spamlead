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
    // Strip ALL whitespace, newlines, and quotes from API key to fix copy-paste word wrapping
    let apiKey = (process.env.GEMINI_API_KEY || '').replace(/\s+/g, '').replace(/^["']|["']$/g, '')
    if (apiKey.includes('=')) {
      apiKey = apiKey.split('=').pop() || apiKey
    }

    if (!apiKey || apiKey.length < 20) {
      return {
        error:
          'Configuration Error: GEMINI_API_KEY is missing or empty in Vercel! Please go to your Vercel Dashboard -> Settings -> Environment Variables, and ensure GEMINI_API_KEY is added with the Production checkbox checked, then redeploy.',
      }
    }

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
    const msg = err.message || 'An error occurred while communicating with Google Gemini.'
    if (msg.toLowerCase().includes('api key') || msg.includes('400') || msg.includes('403')) {
      return {
        error:
          'Google Gemini rejected your API Key (Invalid API key). Please check your Vercel Dashboard -> Settings -> Environment Variables and ensure GEMINI_API_KEY is pasted correctly without quotes or typos, then redeploy.',
      }
    }
    return { error: msg }
  }
}
