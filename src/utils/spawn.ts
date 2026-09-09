import { handleFfmpegError } from './error-handler'

export function withSpawnError<T>(fn: () => T): T {
  try {
    return fn()
  }
  catch (error) {
    throw handleFfmpegError(error)
  }
}
