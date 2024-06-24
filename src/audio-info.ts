import type { FfmpegAudioInfo } from './types';
import { extractError } from './utils/extract-error';

export const audioInfo = async (filePath: string): Promise<FfmpegAudioInfo[]> => {
  const proc = Bun.spawn(
    [
      'ffprobe',
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_entries',
      'stream=codec_name,channels,sample_rate,bit_rate,duration',
      '-of',
      'json',
      filePath,
    ],
    { stderr: 'pipe' },
  );

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const stderr = await Bun.readableStreamToText(proc.stderr);
    const errors = extractError(stderr);
    throw new Error(errors);
  }

  const stdout = (await new Response(proc.stdout).json()) as { streams?: unknown[] };
  const result = stdout?.streams as {
    codec_name: string;
    sample_rate: string;
    channels: number;
    bit_rate: string;
    duration: string;
  }[];

  return result.map((r) => {
    return {
      codec: r.codec_name,
      channels: r.channels,
      sampleRate: r.sample_rate,
      bitrate: r.bit_rate,
      duration: r.duration,
    };
  });
};
