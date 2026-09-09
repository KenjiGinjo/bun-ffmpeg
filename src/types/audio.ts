export type SupportedCodec = 'aac' | 'mp3' | 'pcm_s16le' | 'flac' | 'ogg' | 'wav'
export type SupportedChannels = 1 | 2 | 5.1 | 7.1
export type SupportedSampleRate = 8000 | 16000 | 22050 | 44100 | 48000 | 96000

export interface FfmpegAudioOptions {
  codec?: SupportedCodec | string
  /**
   * @example "192k", "128000"
   */
  bitrate?: string
  channels?: SupportedChannels | number
  sampleRate?: SupportedSampleRate | number
  quality?: number
  /**
   * Muxer for stream output (`-f`). File outputs infer this from the path.
   * @default "wav"
   */
  format?: string
  metadata?: Record<string, string>
  onError?: (error: unknown) => void
}

export interface FfmpegAudioOptionsWithStreamOut {
  onProcessDataFlushed?: (data: Uint8Array | ArrayBuffer | undefined) => void
  onProcessDataEnd: (data: Uint8Array | ArrayBuffer | undefined) => void
}

export interface FfmpegAudioInfo {
  codec: string
  bitrate: string
  channels: number
  sampleRate: string
  duration: string
  metadata?: Record<string, string>
}

export interface AudioInfoOptions {
  metadataTags?: string[]
}
