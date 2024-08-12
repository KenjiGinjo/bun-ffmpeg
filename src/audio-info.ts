import type { AudioInfoOptions, FfmpegAudioInfo } from './types'
import { extractError } from './utils/extract-error'

export async function audioInfo(filePath: string, options?: AudioInfoOptions): Promise<FfmpegAudioInfo[]> {
  const metadataTags = options?.metadataTags || []
  const metadataEntries = metadataTags.length > 0 ? ['-show_entries', `format_tags=${metadataTags.join(',')}`] : []
  const proc = Bun.spawn(
    [
      'ffprobe',
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
    ],
    { stderr: 'pipe' },
  )

  const exitCode = await proc.exited

  if (exitCode !== 0) {
    const stderr = await Bun.readableStreamToText(proc.stderr)
    const errors = extractError(stderr)
    throw new Error(errors)
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
