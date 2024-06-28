export interface FfmpegAudioOptions {
  codec?: 'aac' | 'mp3' | 'pcm_s16le' | string
  /**
   * The bitrate for the audio encoding.
   * @example "192k"
   */
  bitrate?: string
  channels?: 1 | 2 | 5.1 | 7.1 | number
  sampleRate?: 8000 | 16000 | 44100 | 48000 | number
  quality?: number
  onError?: (error: unknown) => void
}
export interface FfmpegAudioOptionsWithStreamOut {
  onProcessDataFlushed: (data: Uint8Array | ArrayBuffer | undefined) => void
  onProcessDataEnd: (data: Uint8Array | ArrayBuffer | undefined) => void
}
export interface FfmpegAudioInfo {
  codec: string
  bitrate: string
  channels: number
  sampleRate: string
  duration: string
}
