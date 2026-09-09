import { describe, expect, it } from 'bun:test'
import { audioInfo } from './audio-info'
import { FfmpegNotFoundError } from './utils/error-handler'

const input = `${import.meta.dir}/samples/input.mp3`

describe('audio-info', () => {
  it('should return the correct audio info', async () => {
    const result = await audioInfo(input)
    expect(result).toEqual([
      {
        codec: 'mp3',
        channels: 1,
        sampleRate: '24000',
        bitrate: '160000',
        duration: '12.312000',
      },
    ])
  })

  it('throws FfmpegNotFoundError when ffprobe is missing', async () => {
    const key = 'FFPROBE_PATH'
    const previous = Bun.env[key]
    Bun.env[key] = '/definitely/missing/bun-ffmpeg-ffprobe'
    try {
      await expect(audioInfo(input)).rejects.toBeInstanceOf(FfmpegNotFoundError)
    }
    finally {
      if (previous === undefined)
        delete Bun.env[key]
      else
        Bun.env[key] = previous
    }
  })
})
