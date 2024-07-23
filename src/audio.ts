import { _spawn, _spawnBuffer } from './_base'
import { audioArgs } from './audio-args'
import type { FfmpegAudioOptions, FfmpegAudioOptionsWithStreamOut } from './types'

export async function audio(input: string, output: string, options?: FfmpegAudioOptions) {
  try {
    await _spawn({ args: ['ffmpeg', '-i', input, ...audioArgs(options), '-y', output] })
  }
  catch (_) {
    options?.onError?.(_)
  }
}

export async function audioWithStreamInput(input: ReadableStream<Uint8Array>, output: string, options?: FfmpegAudioOptions): Promise<void> {
  try {
    await _spawn({ args: ['ffmpeg', '-i', 'pipe:0', ...audioArgs(options), '-y', output], input })
  }
  catch (_) {
    options?.onError?.(_)
  }
}

export async function audioWithStreamOut(input: string, output: FfmpegAudioOptionsWithStreamOut, options?: FfmpegAudioOptions): Promise<void> {
  try {
    await _spawn({ args: ['ffmpeg', '-i', input, ...audioArgs(options), '-f', 'wav', 'pipe:1'], output })
  }
  catch (_) {
    options?.onError?.(_)
  }
}

export async function audioWithStreamInputAndOut(input: ReadableStream<Uint8Array>, output: FfmpegAudioOptionsWithStreamOut, options?: FfmpegAudioOptions): Promise<void> {
  try {
    await _spawn({ args: ['ffmpeg', '-i', 'pipe:0', ...audioArgs(options), '-f', 'wav', 'pipe:1'], input, output })
  }
  catch (_) {
    options?.onError?.(_)
  }
}

export async function audioWav(buffer: Uint8Array): Promise<Uint8Array> {
  const options = {
    codec: 'pcm_s16le',
    bitrate: '128k',
    channels: 1,
    sampleRate: 16000,
  }
  return await _spawnBuffer({
    args: ['ffmpeg', '-i', 'pipe:0', ...audioArgs(options), '-f', 'wav', 'pipe:1'],
    input: buffer,
  })
}
