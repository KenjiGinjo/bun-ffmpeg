import { _spawn } from "./_base";

interface AudioOptions {
  codec: "aac" | "mp3" | "pcm_s16le";
  bitrate: string | number;
  channels: 1 | 2 | 5.1 | 7.1;
  frequency: 8000 | 16000 | 44100 | 48000;
  quality: number;
  onError?: (error: unknown) => void;
}

export const FfmpegAudio = async (
  input: string,
  output: string,
  options: Partial<AudioOptions> = {}
) => {
  const { codec, bitrate, channels, frequency } = options;

  const args = [
    "-i", input,
    ...(codec ? ["-acodec", codec] : []),
    ...(bitrate ? ["-b:a", ("" + bitrate).replace(/k?$/, "k")] : []),
    ...(channels ? ["-ac", "" + channels] : []),
    ...(frequency ? ["-ar", "" + frequency] : []),
    "-y", output
  ];

  try {
    await _spawn(args);
  } catch (_) {
    if (options.onError) {
      options.onError(_);
    }
  }
};