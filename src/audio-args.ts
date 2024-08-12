import type { FfmpegAudioOptions } from './types'

export function audioArgs(options?: FfmpegAudioOptions) {
  if (!options) {
    return []
  }

  const { codec, bitrate, channels, sampleRate, quality, metadata } = options

  return [
    ...(codec ? ['-acodec', codec] : []),
    ...(bitrate ? ['-b:a', bitrate] : []),
    ...(channels ? ['-ac', channels.toString()] : []),
    ...(sampleRate ? ['-ar', sampleRate.toString()] : []),
    ...(quality ? ['-q:a', quality.toString()] : []),
    ...(metadata ? Object.entries(metadata).flatMap(([key, value]) => ['-metadata', `${key}=${value}`]) : []),
  ]
}
