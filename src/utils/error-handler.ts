import { ERROR_MESSAGES, ffmpegNotFoundMessage } from '../config/constants'
import { extractError } from './extract-error'

export class FfmpegError extends Error {
  constructor(
    message: string,
    public readonly exitCode?: number,
    public readonly signalCode?: number | null,
    public readonly stderr?: string,
  ) {
    super(message)
    this.name = 'FfmpegError'
  }
}

export class FfmpegNotFoundError extends FfmpegError {
  constructor(public readonly binary: string) {
    super(ffmpegNotFoundMessage(binary))
    this.name = 'FfmpegNotFoundError'
  }
}

export class FfmpegTimeoutError extends Error {
  constructor(timeout: number) {
    super(`${ERROR_MESSAGES.PROCESS_TIMEOUT} after ${timeout}ms`)
    this.name = 'FfmpegTimeoutError'
  }
}

export function isBinaryNotFoundError(error: unknown, exitCode?: number): boolean {
  if (exitCode === 127)
    return true

  if (!error || typeof error !== 'object')
    return false

  const code = 'code' in error ? error.code : undefined
  const message = 'message' in error && typeof error.message === 'string' ? error.message : ''

  return code === 'ENOENT' || /not found in \$PATH/i.test(message)
}

function binaryFromError(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'path' in error && typeof error.path === 'string' && error.path)
    return error.path

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    const quoted = error.message.match(/"([^"]+)"/)
    if (quoted?.[1])
      return quoted[1]
  }

  return fallback
}

export function handleFfmpegError(
  error: unknown,
  stderr?: string,
  exitCode?: number,
  signalCode?: number | null,
): FfmpegError {
  if (error instanceof FfmpegError) {
    return error
  }

  if (error instanceof FfmpegTimeoutError) {
    return error
  }

  if (isBinaryNotFoundError(error, exitCode)) {
    return new FfmpegNotFoundError(binaryFromError(error, 'ffmpeg'))
  }

  let message: string = ERROR_MESSAGES.PROCESS_EXIT_ERROR

  if (stderr) {
    const extractedError = extractError(stderr)
    message = extractedError || message
  }

  if (exitCode !== undefined) {
    message += ` (exit code: ${exitCode})`
  }

  if (signalCode !== null && signalCode !== undefined) {
    message += ` (signal: ${signalCode})`
  }

  return new FfmpegError(message, exitCode, signalCode, stderr)
}

export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  onError?: (error: unknown) => void,
) {
  return async (...args: T): Promise<R | void> => {
    try {
      return await fn(...args)
    }
    catch (error) {
      const handledError = handleFfmpegError(error)
      onError?.(handledError)
      throw handledError
    }
  }
}
