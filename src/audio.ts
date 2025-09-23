import { executeFfmpegWithBuffer, executeFfmpegWithStreams } from './_base'
import { createFfmpegCommand } from './utils/command-builder'
import { withErrorHandling } from './utils/error-handler'
import { FFMPEG_CONFIG } from './config/constants'
import type { FfmpegAudioOptions, FfmpegAudioOptionsWithStreamOut } from './types'

export async function audio(input: string, output: string, options?: FfmpegAudioOptions): Promise<void> {
  const command = createFfmpegCommand()
    .input(input)
    .audioOptions(options)
    .overwrite()
    .output(output)
    .build()

  const executeWithErrorHandling = withErrorHandling(
    () => executeFfmpegWithStreams({ args: command }),
    options?.onError,
  )

  await executeWithErrorHandling()
}

export async function audioWithStreamInput(input: ReadableStream<Uint8Array>, output: string, options?: FfmpegAudioOptions): Promise<void> {
  const command = createFfmpegCommand()
    .input(FFMPEG_CONFIG.PIPE_INPUT)
    .audioOptions(options)
    .overwrite()
    .output(output)
    .build()

  const executeWithErrorHandling = withErrorHandling(
    () => executeFfmpegWithStreams({ args: command, input }),
    options?.onError,
  )

  await executeWithErrorHandling()
}

export async function audioWithStreamOut(input: string, output: FfmpegAudioOptionsWithStreamOut, options?: FfmpegAudioOptions): Promise<void> {
  const command = createFfmpegCommand()
    .input(input)
    .audioOptions(options)
    .format(FFMPEG_CONFIG.DEFAULT_AUDIO_FORMAT)
    .output(FFMPEG_CONFIG.PIPE_OUTPUT)
    .build()

  const executeWithErrorHandling = withErrorHandling(
    () => executeFfmpegWithStreams({ args: command, output }),
    options?.onError,
  )

  await executeWithErrorHandling()
}

export async function audioWithStreamInputAndOut(input: ReadableStream<Uint8Array>, output: FfmpegAudioOptionsWithStreamOut, options?: FfmpegAudioOptions): Promise<void> {
  const command = createFfmpegCommand()
    .input(FFMPEG_CONFIG.PIPE_INPUT)
    .audioOptions(options)
    .format(FFMPEG_CONFIG.DEFAULT_AUDIO_FORMAT)
    .output(FFMPEG_CONFIG.PIPE_OUTPUT)
    .build()

  const executeWithErrorHandling = withErrorHandling(
    () => executeFfmpegWithStreams({ args: command, input, output }),
    options?.onError,
  )

  await executeWithErrorHandling()
}

export async function audioWav(buffer: Uint8Array): Promise<Uint8Array> {
  const command = createFfmpegCommand()
    .input(FFMPEG_CONFIG.PIPE_INPUT)
    .audioOptions({
      codec: 'pcm_s16le',
      bitrate: '128k',
      channels: 1,
      sampleRate: 16000,
    })
    .format(FFMPEG_CONFIG.DEFAULT_AUDIO_FORMAT)
    .output(FFMPEG_CONFIG.PIPE_OUTPUT)
    .build()

  return await executeFfmpegWithBuffer({
    args: command,
    input: buffer,
  })
}
