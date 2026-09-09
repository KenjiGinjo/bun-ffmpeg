/**
 * Transcode a file to AAC.
 *
 *   bun examples/transcode.ts ./input.mp3 ./output.aac
 */
import process from 'node:process'
import { audio } from 'bun-ffmpeg'

const [input, output] = Bun.argv.slice(2)
if (!input || !output) {
  throw new Error('Usage: bun examples/transcode.ts <input> <output>')
}

await audio(input, output, {
  codec: 'aac',
  bitrate: '192k',
  channels: 2,
  sampleRate: 44100,
})
process.stdout.write(`Wrote ${output}\n`)
