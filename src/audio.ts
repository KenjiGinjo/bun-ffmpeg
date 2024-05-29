import { _spawn } from "./_base";

interface FfmpegAudioOptions {
  codec?: "aac" | "mp3" | "pcm_s16le";
  bitrate?: string | number;
  channels?: 1 | 2 | 5.1 | 7.1;
  frequency?: 8000 | 16000 | 44100 | 48000;
  quality?: number;
  onError?: (error: unknown) => void;
}

export const audioArgs = (input: string,
  output: string, options?: FfmpegAudioOptions) => {

  if (!options) {
    return [
      "-i", input,
      "-y", output
    ];
  }

  const { codec, bitrate, channels, frequency, quality } = options;

  return [
    "-i", input,
    ...(codec ? ["-acodec", codec] : []),
    ...(bitrate ? ["-b:a", ("" + bitrate).replace(/k?$/, "k")] : []),
    ...(channels ? ["-ac", "" + channels] : []),
    ...(frequency ? ["-ar", "" + frequency] : []),
    ...(quality ? ["-q:a", "" + quality] : []),
    "-y", output
  ];
}

export const FfmpegAudio = async (
  input: string,
  output: string,
  options?: FfmpegAudioOptions
) => {
  try {
    await _spawn(audioArgs(input, output, options));
  } catch (_) {
    if (options && options.onError) {
      options.onError(_);
    }
  }
};