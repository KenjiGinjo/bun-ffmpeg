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

  if (input) {
    const reader = input.getReader();

    async function readAndWrite() {
      const { done, value } = await reader.read();
      if (done) {
        proc.stdin.end();
        return;
      }
      proc.stdin.write(value);
      proc.stdin.flush();
      await readAndWrite();
    }

    await readAndWrite();
  }

  if (output) {
    const reader = proc.stdout.getReader();
    const sink = new Bun.ArrayBufferSink();

    sink.start({
      asUint8Array: true,
    });

    async function readAndWriteOutput() {
      const { done, value } = await reader.read();
      if (done) {
        const finalData = sink.end();
        output?.onProcessDataEnd?.(finalData);
        return;
      }

      sink.write(value);
      output?.onProcessDataFlushed?.(value);

      await readAndWriteOutput();
    }

    await readAndWriteOutput();
  }

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    const stderr = await Bun.readableStreamToText(proc.stderr);
    const errors = extractError(stderr);
    throw new Error(errors);
  }
};
