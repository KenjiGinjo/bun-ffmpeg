import { unlink } from 'node:fs/promises'
import { describe, expect, it } from 'bun:test'
import { audio, audioWav, audioWithStreamInput, audioWithStreamInputAndOut, audioWithStreamOut } from './audio'
import { audioInfo } from './audio-info'

const input = `${import.meta.dir}/samples/input.mp3`
const output = `${import.meta.dir}/samples/output.wav`
const outputMp3 = `${import.meta.dir}/samples/output.mp3`

describe('audio', () => {
  it('should throw an error if the input is not a correct path', async () => {
    expect(
      async () =>
        await audio('xxx.xx', 'undefined', {
          codec: 'pcm_s16le',
          channels: 1,
          sampleRate: 16000,
          bitrate: '160k',
          onError: (error) => {
            throw error
          },
        }),
    ).toThrowError()
  })

  it('audio: normal test ', async () => {
    await audio(input, output, {
      codec: 'pcm_s16le',
      channels: 1,
      sampleRate: 16000,
      bitrate: '160k',
    })

    expect(await Bun.file(output).exists()).toBeTrue()

    const result = await audioInfo(output)

    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: '16000',
        bitrate: '256000',
        duration: '12.312000',
      },
    ])

    await unlink(output)
  })

  it('audio: normal test with id3 metadata', async () => {
    await audio(input, outputMp3, {
      codec: 'mp3',
      bitrate: '192k',
      channels: 2,
      sampleRate: 44100,
      metadata: {
        title: 'track title',
        artist: 'track artist',
        album: 'track album',
        comment: 'track comment',
        genre: 'track genre',
        year: '2024',
        track: '1',
        composer: 'track composer',
      },
    })

    expect(await Bun.file(outputMp3).exists()).toBeTrue()

    const result = await audioInfo(outputMp3, {
      metadataTags: ['title', 'artist', 'album', 'track', 'genre', 'composer', 'comment', 'year', 'encoder'],
    })

    expect(result).toEqual([
      {
        codec: 'mp3',
        channels: 2,
        sampleRate: '44100',
        bitrate: '192000',
        duration: '12.355918',
        metadata: {
          title: 'track title',
          artist: 'track artist',
          album: 'track album',
          track: '1',
          genre: 'track genre',
          composer: 'track composer',
          comment: 'track comment',
          year: '2024',
          encoder: 'Lavf61.1.100',
        },
      },
    ])

    await unlink(outputMp3)
  })

  it('audioWithStreamInput: normal test ', async () => {
    const file = Bun.file(input)
    const stream = file.stream()

    await audioWithStreamInput(stream, output, {
      codec: 'pcm_s16le',
      bitrate: '128k',
      channels: 1,
      sampleRate: 16000,
    })

    expect(await Bun.file(output).exists()).toBeTrue()

    await unlink(output)
  })

  it('audioWithStreamOut: normal test ', async () => {
    const fileWritePromise = new Promise<void>((resolve) => {
      audioWithStreamOut(
        input,
        {
          onProcessDataFlushed: () => {},
          onProcessDataEnd: async (data) => {
            await Bun.write(output, data!)
            resolve()
          },
        },
        {
          codec: 'pcm_s16le',
          bitrate: '128k',
          channels: 1,
          sampleRate: 16000,
        },
      )
    })

    await fileWritePromise

    expect(await Bun.file(output).exists()).toBeTrue()

    const result = await audioInfo(output)
    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: '16000',
        bitrate: '256000',
        duration: '12.312000',
      },
    ])

    await unlink(output)
  })

  it('audioWithStreamInputAndOut: normal test', async () => {
    const file = Bun.file(input)
    const stream = file.stream()

    const fileWritePromise = new Promise<void>((resolve) => {
      audioWithStreamInputAndOut(
        stream,
        {
          onProcessDataFlushed: () => {},
          onProcessDataEnd: async (data) => {
            await Bun.write(output, data!)
            resolve()
          },
        },
        {
          codec: 'pcm_s16le',
          bitrate: '128k',
          channels: 1,
          sampleRate: 16000,
        },
      )
    })

    await fileWritePromise

    expect(await Bun.file(output).exists()).toBeTrue()

    const result = await audioInfo(output)
    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: '16000',
        bitrate: '256000',
        duration: '12.312000',
      },
    ])

    await unlink(output)
  })

  it('audioWithStreamInputAndOut: chunks', async () => {
    const file = Bun.file(input)
    const stream = file.stream()

    const { readable, writable } = new TransformStream()
    const reader = stream.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        const writer = writable.getWriter()
        if (done) {
          writer.close()
          break
        }
        writer.write(value)
        writer.releaseLock()
      }
    }
    finally {
      reader.releaseLock()
    }

    const fileWritePromise = new Promise<void>((resolve) => {
      audioWithStreamInputAndOut(
        readable,
        {
          onProcessDataFlushed: () => {},
          onProcessDataEnd: async (data) => {
            await Bun.write(output, data!)
            resolve()
          },
        },
        {
          codec: 'pcm_s16le',
          bitrate: '128k',
          channels: 1,
          sampleRate: 16000,
        },
      )
    })

    await fileWritePromise

    expect(await Bun.file(output).exists()).toBeTrue()

    const result = await audioInfo(output)
    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: '16000',
        bitrate: '256000',
        duration: '12.312000',
      },
    ])

    await unlink(output)
  })

  it('audioBuffer', async () => {
    const arrayBuffer = await Bun.file(input).arrayBuffer()
    const data = await audioWav(new Uint8Array(arrayBuffer))
    await Bun.write(output, data!)
    expect(await Bun.file(output).exists()).toBeTrue()

    const result = await audioInfo(output)
    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: '16000',
        bitrate: '256000',
        duration: '12.312000',
      },
    ])

    await unlink(output)
  })
})
