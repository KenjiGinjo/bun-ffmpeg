import type { FfmpegAudioOptions } from '../types'
import { audioArgs } from '../audio-args'
import { FFMPEG_CONFIG } from '../config/constants'

export class FfmpegCommandBuilder {
  private args: string[] = []

  input(input: string): this {
    this.args.push('-i', input)
    return this
  }

  audioOptions(options?: FfmpegAudioOptions): this {
    this.args.push(...audioArgs(options))
    return this
  }

  format(format: string): this {
    this.args.push('-f', format)
    return this
  }

  output(output: string): this {
    this.args.push(output)
    return this
  }

  overwrite(): this {
    this.args.push('-y')
    return this
  }

  customArgs(args: string[]): this {
    this.args.push(...args)
    return this
  }

  build(): string[] {
    return [FFMPEG_CONFIG.FFMPEG_BINARY, ...this.args]
  }

  reset(): this {
    this.args = []
    return this
  }
}

export function createFfmpegCommand(): FfmpegCommandBuilder {
  return new FfmpegCommandBuilder()
}

export function createFfprobeCommand(): FfmpegCommandBuilder {
  return new FfmpegCommandBuilder().customArgs([FFMPEG_CONFIG.FFPROBE_BINARY])
}
