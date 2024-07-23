import type { FfmpegAudioOptionsWithStreamOut } from './types'
import { extractError } from './utils/extract-error'

export async function _spawn({ args, input, output }: { args: string[], input?: ReadableStream<Uint8Array>, output?: FfmpegAudioOptionsWithStreamOut }) {
  const proc = Bun.spawn(args, {
    stderr: 'pipe',
    stdin: 'pipe',
    stdout: 'pipe',
  })

  let finalData
  const processInput = async () => {
    if (!input) {
      return
    }

    const reader = input.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          proc.stdin.end()
          break
        }
        proc.stdin.write(value)
        proc.stdin.flush()
      }
    }
    finally {
      reader.releaseLock()
    }
  }

  const processOutput = async () => {
    if (!output) {
      return
    }

    const reader = proc.stdout.getReader()
    const sink = new Bun.ArrayBufferSink()
    sink.start({ asUint8Array: true })

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          finalData = sink.end()
          output?.onProcessDataEnd?.(finalData)
          break
        }
        sink.write(value)
        output?.onProcessDataFlushed?.(value)
      }
    }
    finally {
      reader.releaseLock()
    }
  }

  await Promise.all([processInput(), processOutput()])

  const exitCode = await proc.exited
  if (exitCode !== 0) {
    const stderr = await Bun.readableStreamToText(proc.stderr)
    const errors = extractError(stderr)
    throw new Error(errors)
  }

  if (finalData) {
    return finalData
  }
}

export async function _spawnBuffer({ args, input, timeout = 30000 }: { args: string[], input: Uint8Array, timeout?: number }) {
  return new Promise<Uint8Array>((resolve, reject) => {
    const proc = Bun.spawn(args, {
      stdin: 'pipe',
      stderr: 'pipe',
    })

    proc.stdin.write(input)
    proc.stdin.end()

    const sink = new Bun.ArrayBufferSink()
    sink.start({ asUint8Array: true })

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        proc.kill()
        reject(new Error('Process timed out'))
      }, timeout)
    });

    (async () => {
      try {
        await Promise.race([
          (async () => {
            for await (const chunk of proc.stdout) {
              sink.write(chunk)
            }
            const exitCode = await proc.exited
            const signalCode = proc.signalCode
            if (exitCode !== 0 || signalCode !== null) {
              const stderr = await Bun.readableStreamToText(proc.stderr)
              const errors = extractError(stderr)
              throw new Error(`Process exited with code ${exitCode}, signal ${signalCode}. Errors: ${errors}`)
            }
            resolve(sink.end() as Uint8Array)
          })(),
          timeoutPromise,
        ])
      }
      catch (error) {
        proc.kill()
        reject(error)
      }
    })()
  })
}
