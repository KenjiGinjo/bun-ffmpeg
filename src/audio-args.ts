import type { FfmpegAudioOptions } from "./types";

export const audioArgs = (options?: FfmpegAudioOptions) => {
  if (!options) {
    return [];
  }

  const { codec, bitrate, channels, sampleRate, quality } = options;

  return [
    ...(codec ? ["-acodec", codec] : []),
    ...(bitrate ? ["-b:a", bitrate] : []),
    ...(channels ? ["-ac", "" + channels] : []),
    ...(sampleRate ? ["-ar", "" + sampleRate] : []),
    ...(quality ? ["-q:a", "" + quality] : []),
  ];
};
