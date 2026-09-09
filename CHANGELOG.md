# Changelog

## Unreleased

- Resolve `ffmpeg` / `ffprobe` via `FFMPEG_PATH` and `FFPROBE_PATH`.
- Throw `FfmpegNotFoundError` with install hints when the binary is missing.

## 0.2.3

- Document Bun-native audio positioning, Whisper `audioWav`, and ffmpeg as a system dependency.
- Fix `createFfprobeCommand()` so the binary is `ffprobe`, not `ffmpeg ffprobe`.
- Allow `options.format` on stream output (default remains `wav`).
- Add `examples/whisper-prep.ts` and `examples/transcode.ts`.

## 0.2.2

- Command builder + structured `FfmpegError` / timeout handling.

## 0.2.0

- ID3 metadata in / out via `audio` and `audioInfo`.
