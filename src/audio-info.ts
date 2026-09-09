import type { AudioInfoOptions, FfmpegAudioInfo } from './types'
import { createFfprobeCommand } from './utils/command-builder'
import { handleFfmpegError } from './utils/error-handler'
import { withSpawnError } from './utils/spawn'

export async function audioInfo(filePath: string, options?: AudioInfoOptions): Promise<FfmpegAudioInfo[]> {
  const metadataTags = options?.metadataTags || []
  const metadataEntries = metadataTags.length > 0 ? ['-show_entries', `format_tags=${metadataTags.join(',')}`] : []

  const command = createFfprobeCommand()
    .customArgs([
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_entries',
      'stream=codec_name,channels,sample_rate,bit_rate,duration',
      ...metadataEntries,
      '-of',
      'json',
      filePath,
    ])
    .build()

  const proc = withSpawnError(() => Bun.spawn(command, { stderr: 'pipe' }))

  const exitCode = await proc.exited

  if (exitCode !== 0) {
    const stderr = await Bun.readableStreamToText(proc.stderr)
    throw handleFfmpegError(new Error('FFprobe process failed'), stderr, exitCode)
  }

  const stdout = (await new Response(proc.stdout).json()) as { streams?: unknown[], format?: { tags?: Record<string, string> } }
  const streamInfo = stdout?.streams as {
    codec_name: string
    sample_rate: string
    channels: number
    bit_rate: string
    duration: string
  }[]

  const metadata = stdout?.format?.tags

  return streamInfo.map((r) => {
    const info: FfmpegAudioInfo = {
      codec: r.codec_name,
      channels: r.channels,
      sampleRate: r.sample_rate,
      bitrate: r.bit_rate,
      duration: r.duration,
    }

    if (metadata && Object.keys(metadata).length > 0 && metadataTags.length > 0) {
      info.metadata = {}
      for (const tag of metadataTags) {
        if (metadata[tag]) {
          info.metadata[tag] = metadata[tag]
        }
      }
    }

    return info
  })
}
