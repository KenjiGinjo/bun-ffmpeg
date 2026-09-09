import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { createFfmpegCommand, createFfprobeCommand } from './command-builder'

const FFMPEG_PATH = 'FFMPEG_PATH'
const FFPROBE_PATH = 'FFPROBE_PATH'
const originalFfmpegPath = Bun.env[FFMPEG_PATH]
const originalFfprobePath = Bun.env[FFPROBE_PATH]

function restoreEnv() {
  if (originalFfmpegPath === undefined)
    delete Bun.env[FFMPEG_PATH]
  else
    Bun.env[FFMPEG_PATH] = originalFfmpegPath

  if (originalFfprobePath === undefined)
    delete Bun.env[FFPROBE_PATH]
  else
    Bun.env[FFPROBE_PATH] = originalFfprobePath
}

describe('command-builder', () => {
  beforeEach(() => {
    delete Bun.env[FFMPEG_PATH]
    delete Bun.env[FFPROBE_PATH]
  })
  afterEach(restoreEnv)

  it('createFfmpegCommand starts with ffmpeg', () => {
    const args = createFfmpegCommand()
      .input('in.mp3')
      .overwrite()
      .output('out.aac')
      .build()

    expect(args[0]).toBe('ffmpeg')
    expect(args).toEqual(['ffmpeg', '-i', 'in.mp3', '-y', 'out.aac'])
  })

  it('createFfprobeCommand starts with ffprobe, not ffmpeg', () => {
    const args = createFfprobeCommand()
      .customArgs(['-v', 'error', '-show_format', 'in.mp3'])
      .build()

    expect(args[0]).toBe('ffprobe')
    expect(args).not.toContain('ffmpeg')
    expect(args).toEqual(['ffprobe', '-v', 'error', '-show_format', 'in.mp3'])
  })

  it('adds -f for stream muxer format', () => {
    const args = createFfmpegCommand()
      .input('in.mp3')
      .format('mp3')
      .output('pipe:1')
      .build()

    expect(args).toEqual(['ffmpeg', '-i', 'in.mp3', '-f', 'mp3', 'pipe:1'])
  })

  it('uses FFMPEG_PATH and FFPROBE_PATH', () => {
    Bun.env[FFMPEG_PATH] = '/opt/custom/ffmpeg'
    Bun.env[FFPROBE_PATH] = '/opt/custom/ffprobe'

    expect(createFfmpegCommand().output('out.wav').build()[0]).toBe('/opt/custom/ffmpeg')
    expect(createFfprobeCommand().build()[0]).toBe('/opt/custom/ffprobe')
  })
})
