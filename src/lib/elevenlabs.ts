import axios from 'axios'

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY

// Default voices to use
export const DEFAULT_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Warm, friendly female voice' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, confident female voice' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, soothing female voice' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded male voice' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Young, energetic female voice' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep, authoritative male voice' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Crisp, confident male voice' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, narration-style male voice' },
]

interface TextToSpeechOptions {
  text: string
  voiceId?: string
  modelId?: string
  stability?: number
  similarityBoost?: number
}

interface Voice {
  voice_id: string
  name: string
  category?: string
  labels?: Record<string, string>
}

export const elevenLabs = {
  // Get all available voices
  async getVoices(): Promise<Voice[]> {
    if (!API_KEY) {
      console.warn('ElevenLabs API key not configured')
      return DEFAULT_VOICES.map(v => ({ voice_id: v.id, name: v.name }))
    }

    try {
      const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
        headers: { 'xi-api-key': API_KEY },
      })
      return response.data.voices
    } catch (error) {
      console.error('Error fetching voices:', error)
      return DEFAULT_VOICES.map(v => ({ voice_id: v.id, name: v.name }))
    }
  },

  // Generate speech from text
  async textToSpeech({
    text,
    voiceId = DEFAULT_VOICES[0].id,
    modelId = 'eleven_monolingual_v1',
    stability = 0.5,
    similarityBoost = 0.75,
  }: TextToSpeechOptions): Promise<Blob> {
    if (!API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      },
      {
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'blob',
      }
    )

    return response.data
  },

  // Generate speech with streaming
  async textToSpeechStream({
    text,
    voiceId = DEFAULT_VOICES[0].id,
    modelId = 'eleven_monolingual_v1',
    stability = 0.5,
    similarityBoost = 0.75,
  }: TextToSpeechOptions): Promise<ReadableStream> {
    if (!API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    return response.body!
  },

  // Clone a voice from audio samples
  async cloneVoice(
    name: string,
    description: string,
    files: File[]
  ): Promise<string> {
    if (!API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/voices/add`,
      formData,
      {
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data.voice_id
  },

  // Delete a cloned voice
  async deleteVoice(voiceId: string): Promise<void> {
    if (!API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    await axios.delete(`${ELEVENLABS_API_URL}/voices/${voiceId}`, {
      headers: { 'xi-api-key': API_KEY },
    })
  },

  // Get voice info
  async getVoice(voiceId: string): Promise<Voice> {
    if (!API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    const response = await axios.get(`${ELEVENLABS_API_URL}/voices/${voiceId}`, {
      headers: { 'xi-api-key': API_KEY },
    })

    return response.data
  },

  // Get subscription info (useful for checking remaining characters)
  async getSubscription(): Promise<{
    character_count: number
    character_limit: number
    can_extend_character_limit: boolean
  }> {
    if (!API_KEY) {
      throw new Error('ElevenLabs API key not configured')
    }

    const response = await axios.get(`${ELEVENLABS_API_URL}/user/subscription`, {
      headers: { 'xi-api-key': API_KEY },
    })

    return response.data
  },
}
