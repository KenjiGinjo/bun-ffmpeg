# bun-ffmpeg

`bun-ffmpeg` is an audio processing library based on FFmpeg, built with Bun, designed to simplify audio encoding and processing workflows.

_For now Audio Processing Only_

## Features

- **Audio Encoding**: Supports audio codecs such as `aac`, `mp3`, and `pcm_s16le`.
- **Audio Parameters**: Allows setting bitrate, channels, and sample rate.
- **Stream Processing**: Supports stream input and output for real-time audio data processing.

## Installation

Install `bun-ffmpeg` using npm:

```bash
bun add bun-ffmpeg -D
```

## Usage

### Basic Audio Processing

Import and use the `audio` function to process audio files:

```typescript
import { audio } from 'bun-ffmpeg';

const options = {
  codec: 'aac',
  bitrate: '192k',
  channels: 2,
  sampleRate: 44100,
  onError: (error) => console.error('Error processing audio:', error),
};

audio('input.mp3', 'output.aac', options);
```

### Stream Input

Use the `audioWithStreamInput` function to process audio from a readable stream:

```typescript
import { audioWithStreamInput } from 'bun-ffmpeg';

const options = {
  codec: 'mp3',
  bitrate: '128k',
  channels: 2,
  sampleRate: 44100,
  onError: (error) => console.error('Error processing audio:', error),
};

// Example of using a ReadableStream as input
const inputStream = getReadableStreamSomehow();

audioWithStreamInput(inputStream, 'output.mp3', options);
```

### Stream Output

Use the `audioWithStreamOut` function to process audio and output to a writable stream:

```typescript
import { audioWithStreamOut } from 'bun-ffmpeg';

const options = {
  codec: 'pcm_s16le',
  channels: 2,
  sampleRate: 48000,
  onError: (error) => console.error('Error processing audio:', error),
};

const outputHandlers = {
  onProcessDataFlushed: (data) => {
    // Handle flushed data
  },
  onProcessDataEnd: (data) => {
    // Handle end of data
  },
};

audioWithStreamOut('input.mp3', outputHandlers, options);
```

### Stream Input and Output

Use the `audioWithStreamInputAndOut` function to process audio from a readable stream and output to a writable stream:

```typescript
import { audioWithStreamInputAndOut } from 'bun-ffmpeg';

const options = {
  codec: 'aac',
  bitrate: '256k',
  channels: 5.1,
  sampleRate: 44100,
  onError: (error) => console.error('Error processing audio:', error),
};

const inputStream = getReadableStreamSomehow();

const outputHandlers = {
  onProcessDataFlushed: (data) => {
    // Handle flushed data
  },
  onProcessDataEnd: (data) => {
    // Handle end of data
  },
};

audioWithStreamInputAndOut(inputStream, outputHandlers, options);
```

## Contributing

We welcome contributions to `bun-ffmpeg`! Whether it's feature suggestions, bug reports, or code contributions, your help is highly appreciated. Please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/KenjiGinjo/bun-ffmpeg).

## License

`bun-ffmpeg` is open-sourced software licensed under the MIT license.

## Contact

Kenji - [kenjiginjo@gmail.com](mailto:kenjiginjo@gmail.com)

Project Link: [https://github.com/KenjiGinjo/bun-ffmpeg](https://github.com/KenjiGinjo/bun-ffmpeg)
