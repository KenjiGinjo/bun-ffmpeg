# bun-ffmpeg

[![npm](https://img.shields.io/npm/v/bun-ffmpeg)](https://www.npmjs.com/package/bun-ffmpeg)
[![npm downloads](https://img.shields.io/npm/dm/bun-ffmpeg)](https://www.npmjs.com/package/bun-ffmpeg)
[![CI](https://github.com/KenjiGinjo/bun-ffmpeg/actions/workflows/ci.yml/badge.svg)](https://github.com/KenjiGinjo/bun-ffmpeg/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Bun-native audio processing via the system `ffmpeg` binary. No Node compatibility layer, no bundled binary — just `Bun.spawn` and typed helpers.

**Audio only.** For video, filters, or a full fluent API, use [`fluent-ffmpeg`](https://www.npmjs.com/package/fluent-ffmpeg).

## Requirements

- [Bun](https://bun.sh) `>= 1.1`
- `ffmpeg` and `ffprobe` on your `PATH`

```bash
ffmpeg -version
ffprobe -version
```

macOS: `brew install ffmpeg` · Debian/Ubuntu: `sudo apt install ffmpeg` · Windows: [ffmpeg.org](https://ffmpeg.org/download.html)

## Install

```bash
bun add bun-ffmpeg
```

## When to use this

| Need | Use |
| --- | --- |
| Transcode / resample audio in a Bun app | **bun-ffmpeg** |
| 16 kHz mono PCM for Whisper / other STT | **`audioWav`** |
| Stream in or out without temp files | **bun-ffmpeg** |
| Video, filters, complex graphs | fluent-ffmpeg (or raw ffmpeg) |
| Node.js | not this package (`Bun.spawn` only) |

## Usage

### File transcode

```typescript
import { audio } from 'bun-ffmpeg'

await audio('input.mp3', 'output.aac', {
  codec: 'aac',
  bitrate: '192k',
  channels: 2,
  sampleRate: 44100,
})
```

### Whisper / STT prep

Converts any ffmpeg-readable audio into 16 kHz, mono, `pcm_s16le` WAV:

```typescript
import { audioWav } from 'bun-ffmpeg'

const wav = await audioWav(new Uint8Array(await Bun.file('input.mp3').arrayBuffer()))
await Bun.write('input.16k.wav', wav)
```

### Probe metadata

```typescript
import { audioInfo } from 'bun-ffmpeg'

const [info] = await audioInfo('input.mp3')
// { codec, channels, sampleRate, bitrate, duration }

const [tagged] = await audioInfo('input.mp3', {
  metadataTags: ['title', 'artist', 'album'],
})
```

### Write ID3 tags while encoding

```typescript
import { audio } from 'bun-ffmpeg'

await audio('input.wav', 'output.mp3', {
  codec: 'mp3',
  bitrate: '192k',
  metadata: {
    title: 'Track title',
    artist: 'Artist',
    album: 'Album',
    year: '2026',
  },
})
```

### Stream input

```typescript
import { audioWithStreamInput } from 'bun-ffmpeg'

await audioWithStreamInput(Bun.file('input.mp3').stream(), 'output.mp3', {
  codec: 'mp3',
  bitrate: '128k',
  channels: 2,
  sampleRate: 44100,
})
```

### Stream output

Stream APIs write to stdout and need an explicit muxer. Default is WAV; pass `format` to change it:

```typescript
import { audioWithStreamOut } from 'bun-ffmpeg'

await new Promise<void>((resolve, reject) => {
  audioWithStreamOut(
    'input.mp3',
    {
      onProcessDataFlushed: () => {},
      onProcessDataEnd: async (data) => {
        if (data)
          await Bun.write('output.mp3', data)
        resolve()
      },
    },
    {
      codec: 'mp3',
      bitrate: '128k',
      format: 'mp3',
      onError: reject,
    },
  )
})
```

### Stream in and out

```typescript
import { audioWithStreamInputAndOut } from 'bun-ffmpeg'

await new Promise<void>((resolve, reject) => {
  audioWithStreamInputAndOut(
    Bun.file('input.mp3').stream(),
    {
      onProcessDataFlushed: () => {},
      onProcessDataEnd: async (data) => {
        if (data)
          await Bun.write('output.wav', data)
        resolve()
      },
    },
    {
      codec: 'pcm_s16le',
      channels: 1,
      sampleRate: 16000,
      onError: reject,
    },
  )
})
```

Runnable examples: [`examples/whisper-prep.ts`](examples/whisper-prep.ts), [`examples/transcode.ts`](examples/transcode.ts). More cases in [`src/audio.test.ts`](src/audio.test.ts).

## API

| Function | Input | Output |
| --- | --- | --- |
| `audio(input, output, options?)` | file path | file path |
| `audioWav(buffer)` | `Uint8Array` | `Uint8Array` (16 kHz mono WAV) |
| `audioInfo(path, options?)` | file path | stream metadata |
| `audioWithStreamInput(stream, output, options?)` | `ReadableStream` | file path |
| `audioWithStreamOut(input, handlers, options?)` | file path | chunks via handlers (default WAV, or `options.format`) |
| `audioWithStreamInputAndOut(stream, handlers, options?)` | `ReadableStream` | chunks via handlers (default WAV, or `options.format`) |

`FfmpegAudioOptions`: `codec`, `bitrate`, `channels`, `sampleRate`, `quality`, `format`, `metadata`, `onError`.

Errors are `FfmpegError` / `FfmpegTimeoutError` (buffer path defaults to 30s).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Issues and PRs: [github.com/KenjiGinjo/bun-ffmpeg](https://github.com/KenjiGinjo/bun-ffmpeg).

## License

MIT
