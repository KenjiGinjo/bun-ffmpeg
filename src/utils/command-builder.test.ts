import { describe, expect, it } from 'bun:test'
import { createFfmpegCommand, createFfprobeCommand } from './command-builder'

describe('command-builder', () => {
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
})
