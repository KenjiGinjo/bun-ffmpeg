import { _spawn } from './_base';
import { audioArgs } from './audio-args';
import type { FfmpegAudioOptions, FfmpegAudioOptionsWithStreamOut } from './types';

export const audio = async (input: string, output: string, options?: FfmpegAudioOptions) => {
  try {
    await _spawn(['ffmpeg', '-i', input, ...audioArgs(options), '-y', output]);
  } catch (_) {
    options?.onError?.(_);
  }
};

export const audioWithStreamInput = async (
  input: ReadableStream<Uint8Array>,
  output: string,
  options?: FfmpegAudioOptions,
): Promise<void> => {
  try {
    await _spawn(['ffmpeg', '-i', 'pipe:0', ...audioArgs(options), '-y', output], input);
  } catch (_) {
    options?.onError?.(_);
  }
};

export const audioWithStreamOut = async (
  input: string,
  output: FfmpegAudioOptionsWithStreamOut,
  options?: FfmpegAudioOptions,
): Promise<void> => {
  try {
    await _spawn(['ffmpeg', '-i', input, ...audioArgs(options), '-f', 'wav', 'pipe:1'], undefined, output);
  } catch (_) {
    options?.onError?.(_);
  }
};

export const audioWithStreamInputAndOut = async (
  input: ReadableStream<Uint8Array>,
  output: FfmpegAudioOptionsWithStreamOut,
  options?: FfmpegAudioOptions,
): Promise<void> => {
  try {
    await _spawn(['ffmpeg', '-i', 'pipe:0', ...audioArgs(options), '-f', 'wav', 'pipe:1'], input, output);
  } catch (_) {
    options?.onError?.(_);
  }
};
