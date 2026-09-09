import { describe, expect, it } from 'bun:test'
import { FfmpegNotFoundError, handleFfmpegError, isBinaryNotFoundError } from './error-handler'

describe('handleFfmpegError', () => {
  it('maps ENOENT to FfmpegNotFoundError with install hints', () => {
    const error = Object.assign(new Error('Executable not found in $PATH: "ffmpeg"'), { code: 'ENOENT' })
    const handled = handleFfmpegError(error)

    expect(handled).toBeInstanceOf(FfmpegNotFoundError)
    expect(handled.message).toContain('brew install ffmpeg')
    expect(handled.message).toContain('FFMPEG_PATH')
  })

  it('maps exit code 127 to FfmpegNotFoundError', () => {
    const handled = handleFfmpegError(new Error('failed'), undefined, 127)
    expect(handled).toBeInstanceOf(FfmpegNotFoundError)
  })

  it('detects PATH lookup failures', () => {
    expect(isBinaryNotFoundError({ code: 'ENOENT' })).toBe(true)
    expect(isBinaryNotFoundError(new Error('boom'))).toBe(false)
  })
})
