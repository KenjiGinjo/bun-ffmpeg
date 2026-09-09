/**
 * Convert any ffmpeg-readable audio file to 16 kHz mono WAV (Whisper / STT).
 *
 *   bun examples/whisper-prep.ts ./input.mp3
 */
import process from 'node:process'
import { audioWav } from 'bun-ffmpeg'

const input = Bun.argv[2]
if (!input) {
  throw new Error('Usage: bun examples/whisper-prep.ts <audio-file>')
}

const wav = await audioWav(new Uint8Array(await Bun.file(input).arrayBuffer()))
const out = input.replace(/\.[^.]+$/, '.16k.wav')
await Bun.write(out, wav)
process.stdout.write(`Wrote ${out} (${wav.byteLength} bytes)\n`)
