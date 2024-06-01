import { describe, expect, it } from 'bun:test';
import { unlink } from 'node:fs/promises';
import { audio, audioWithStreamInput, audioWithStreamInputAndOut, audioWithStreamOut } from './audio';
import { audioInfo } from './audio-info';

const input = `${import.meta.dir}/samples/input.mp3`;
const output = `${import.meta.dir}/samples/output.wav`;

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
            throw error;
          },
        }),
    ).toThrowError();
  });

  it('audio: normal test ', async () => {
    await audio(input, output, {
      codec: 'pcm_s16le',
      channels: 1,
      sampleRate: 16000,
      bitrate: '160k',
    });

    expect(await Bun.file(output).exists()).toBeTrue();

    const result = await audioInfo(output);

    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: 16000,
        bitrate: '256000',
      },
    ]);

    await unlink(output);
  });

  it('audioWithStreamInput: normal test ', async () => {
    const file = Bun.file(input);
    const stream = file.stream();

    await audioWithStreamInput(stream, output, {
      codec: 'pcm_s16le',
      bitrate: '128k',
      channels: 1,
      sampleRate: 16000,
    });

    expect(await Bun.file(output).exists()).toBeTrue();

    await unlink(output);
  });

  it('audioWithStreamOut: normal test ', async () => {
    const fileWritePromise = new Promise<void>((resolve) => {
      audioWithStreamOut(
        input,
        {
          onProcessDataFlushed: () => {},
          onProcessDataEnd: async (data) => {
            await Bun.write(output, data!);
            resolve();
          },
        },
        {
          codec: 'pcm_s16le',
          bitrate: '128k',
          channels: 1,
          sampleRate: 16000,
        },
      );
    });

    await fileWritePromise;

    expect(await Bun.file(output).exists()).toBeTrue();

    const result = await audioInfo(output);
    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: 16000,
        bitrate: '256000',
      },
    ]);

    await unlink(output);
  });

  it('audioWithStreamInputAndOut: normal test', async () => {
    const file = Bun.file(input);
    const stream = file.stream();

    const fileWritePromise = new Promise<void>((resolve) => {
      audioWithStreamInputAndOut(
        stream,
        {
          onProcessDataFlushed: () => {},
          onProcessDataEnd: async (data) => {
            await Bun.write(output, data!);
            resolve();
          },
        },
        {
          codec: 'pcm_s16le',
          bitrate: '128k',
          channels: 1,
          sampleRate: 16000,
        },
      );
    });

    await fileWritePromise;

    expect(await Bun.file(output).exists()).toBeTrue();

    const result = await audioInfo(output);
    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: 16000,
        bitrate: '256000',
      },
    ]);

    await unlink(output);
  });

  it('audioWithStreamInputAndOut: chunks', async () => {
    const file = Bun.file(input);
    const stream = file.stream();

    const { readable, writable } = new TransformStream();
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        const writer = writable.getWriter();
        if (done) {
          writer.close();
          break;
        }
        writer.write(value);
        writer.releaseLock();
      }
    } finally {
      reader.releaseLock();
    }

    const fileWritePromise = new Promise<void>((resolve) => {
      audioWithStreamInputAndOut(
        readable,
        {
          onProcessDataFlushed: () => {},
          onProcessDataEnd: async (data) => {
            await Bun.write(output, data!);
            resolve();
          },
        },
        {
          codec: 'pcm_s16le',
          bitrate: '128k',
          channels: 1,
          sampleRate: 16000,
        },
      );
    });

    await fileWritePromise;

    expect(await Bun.file(output).exists()).toBeTrue();

    const result = await audioInfo(output);
    expect(result).toEqual([
      {
        codec: 'pcm_s16le',
        channels: 1,
        sampleRate: 16000,
        bitrate: '256000',
      },
    ]);

    await unlink(output);
  });
});
