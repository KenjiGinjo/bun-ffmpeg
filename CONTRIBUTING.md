# Contributing

Need: [Bun](https://bun.sh) `>= 1.1`, plus `ffmpeg` and `ffprobe` on `PATH`.

```bash
bun install
bun test
bun lint
bun typecheck
```

- Conventional Commits (`feat:`, `fix:`, `docs:`). `bun commit` if you want the prompt.
- Keep the surface **audio-only**. Video / fluent-style APIs belong in a different package.
- Tests that touch real files live in `src/*.test.ts` and use `src/samples/input.mp3`.
- Runnable snippets go in `examples/`.
