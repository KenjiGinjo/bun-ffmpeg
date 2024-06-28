import { describe, expect, it } from 'bun:test'
import { extractError } from './extract-error'

describe('extractError', () => {
  it('should extract error messages from stderr', () => {
    const stderr = 'Error: Something went wrong\n    at doSomething (index.js:10:5)\n    at main (index.js:5:3)'
    const expected = 'Error: Something went wrong'

    const result = extractError(stderr)

    expect(result).toEqual(expected)
  })

  it('should handle empty stderr', () => {
    const stderr = ''
    const expected = ''

    const result = extractError(stderr)

    expect(result).toEqual(expected)
  })

  it('should handle stderr with only whitespace', () => {
    const stderr = '   \n   \n   '
    const expected = ''

    const result = extractError(stderr)

    expect(result).toEqual(expected)
  })

  it('should handle stderr with practical result', () => {
    const stderr = `ffmpeg version 7.0 Copyright (c) 2000-2024 the FFmpeg developers\n  bla bla bla\n  bla bla bla\n[in#0 @ 0x12572b220] Error opening input: No such file or directory\nError opening input file /GitHub/bun-ffmpeg/inp2ut.mp3.\nError opening input files: No such file or directory\n`
    const expected = `ffmpeg version 7.0 Copyright (c) 2000-2024 the FFmpeg developers\nError opening input file /GitHub/bun-ffmpeg/inp2ut.mp3.\nError opening input files: No such file or directory\n`

    const result = extractError(stderr)

    expect(result).toEqual(expected)
  })
})
