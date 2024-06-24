import { describe, expect, it } from 'bun:test';
import { audioArgs } from './audio-args';

describe('audioArgs', () => {
  it('should generate arguments with all options', () => {
    const result = audioArgs({
      codec: 'mp3',
      bitrate: '128k',
      channels: 2,
      sampleRate: 44100,
      quality: 5,
    });

    expect(result).toEqual([
      '-acodec',
      'mp3',
      '-b:a',
      '128k',
      '-ac',
      '2',
      '-ar',
      '44100',
      '-q:a',
      '5',
    ]);
  });

  it('should generate arguments with only required options', () => {
    const result = audioArgs({
      codec: 'aac',
    });

    expect(result).toEqual(['-acodec', 'aac']);
  });

  it('should generate arguments with no options', () => {
    const result = audioArgs();

    expect(result).toEqual([]);
  });
});
