export const FFMPEG_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  FFMPEG_BINARY: 'ffmpeg',
  FFPROBE_BINARY: 'ffprobe',
  DEFAULT_AUDIO_FORMAT: 'wav',
  PIPE_INPUT: 'pipe:0',
  PIPE_OUTPUT: 'pipe:1',
} as const

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
