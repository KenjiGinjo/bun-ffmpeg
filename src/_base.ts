import type { FfmpegAudioOptionsWithStreamOut } from './types';
import { extractError } from './utils/extract-error';

export const _spawn = async (
  args: string[],
  input?: ReadableStream<Uint8Array>,
  output?: FfmpegAudioOptionsWithStreamOut,
) => {
  const proc = Bun.spawn(args, {
    stderr: 'pipe',
    stdin: 'pipe',
    stdout: 'pipe',
  });

  const processInput = async () => {
    if (!input) return;
    const reader = input.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          proc.stdin.end();
          break;
        }
        proc.stdin.write(value);
        proc.stdin.flush();
      }
    } finally {
      reader.releaseLock();
    }
  };

  const processOutput = async () => {
    if (!output) return;
    const reader = proc.stdout.getReader();
    const sink = new Bun.ArrayBufferSink();
    sink.start({ asUint8Array: true });

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          const finalData = sink.end();
          output?.onProcessDataEnd?.(finalData);
          break;
        }
        sink.write(value);
        output?.onProcessDataFlushed?.(value);
      }
    } finally {
      reader.releaseLock();
    }
  };

  await Promise.all([processInput(), processOutput()]);

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    const stderr = await Bun.readableStreamToText(proc.stderr);
    const errors = extractError(stderr);
    throw new Error(errors);
  }
};
