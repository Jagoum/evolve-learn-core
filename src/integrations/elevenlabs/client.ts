const ELEVENLABS_API_KEY = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY : process.env.ELEVENLABS_API_KEY
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

export class ElevenLabsClient {
  private apiKey: string

  constructor() {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is required')
    }
    this.apiKey = ELEVENLABS_API_KEY
  }

  // Text-to-Speech
  async textToSpeech(text: string, voiceId: string = '21m00Tcm4TlvDq8ikWAM'): Promise<ArrayBuffer> {
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`TTS failed: ${response.statusText}`)
    }

    return response.arrayBuffer()
  }

  // Speech-to-Text (using Whisper)
  async speechToText(audioBlob: Blob): Promise<string> {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    formData.append('model', 'whisper-1')

    const response = await fetch(`${ELEVENLABS_API_URL}/speech-to-text`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`STT failed: ${response.statusText}`)
    }

    const result = await response.json()
    return result.text
  }

  // Get available voices
  async getVoices(): Promise<any[]> {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`)
    }

    const result = await response.json()
    return result.voices
  }

  // Generate audio from text with specific voice settings
  async generateAudio(text: string, voiceId: string, settings?: {
    stability?: number
    similarity_boost?: number
    style?: number
    use_speaker_boost?: boolean
  }): Promise<ArrayBuffer> {
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: settings?.stability ?? 0.5,
          similarity_boost: settings?.similarity_boost ?? 0.5,
          style: settings?.style ?? 0.0,
          use_speaker_boost: settings?.use_speaker_boost ?? true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Audio generation failed: ${response.statusText}`)
    }

    return response.arrayBuffer()
  }
}

// Create a singleton instance
export const elevenLabsClient = new ElevenLabsClient() 