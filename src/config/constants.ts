export const FFMPEG_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  FFMPEG_BINARY: 'ffmpeg',
  FFPROBE_BINARY: 'ffprobe',
  DEFAULT_AUDIO_FORMAT: 'wav',
  PIPE_INPUT: 'pipe:0',
  PIPE_OUTPUT: 'pipe:1',
} as const

export function resolveFfmpegBinary(): string {
  return envValue('FFMPEG_PATH') || FFMPEG_CONFIG.FFMPEG_BINARY
}

export function resolveFfprobeBinary(): string {
  return envValue('FFPROBE_PATH') || FFMPEG_CONFIG.FFPROBE_BINARY
}

function envValue(name: string): string | undefined {
  const value = Bun.env[name]
  return value?.trim() || undefined
}

export const DEFAULT_AUDIO_OPTIONS = {
  codec: 'pcm_s16le' as const,
  bitrate: '128k',
  channels: 1,
  sampleRate: 16000,
} as const

export const ERROR_MESSAGES = {
  PROCESS_TIMEOUT: 'Process timed out',
  PROCESS_EXIT_ERROR: 'Process exited with non-zero code',
  INVALID_INPUT: 'Invalid input file or stream',
  FFMPEG_NOT_FOUND: 'FFmpeg not found. Please ensure FFmpeg is installed and in PATH',
} as const

export function ffmpegNotFoundMessage(binary: string): string {
  const envName = binary.includes('ffprobe') ? 'FFPROBE_PATH' : 'FFMPEG_PATH'

  return [
    `Could not find \`${binary}\`. Install FFmpeg and put it on PATH, or set ${envName}.`,
    'macOS: brew install ffmpeg',
    'Debian/Ubuntu: sudo apt install ffmpeg',
    'Windows: https://ffmpeg.org/download.html',
  ].join('\n')
}
