import { ERROR_MESSAGES } from '../config/constants'
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

export class FfmpegTimeoutError extends Error {
  constructor(timeout: number) {
    super(`${ERROR_MESSAGES.PROCESS_TIMEOUT} after ${timeout}ms`)
    this.name = 'FfmpegTimeoutError'
  }
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
