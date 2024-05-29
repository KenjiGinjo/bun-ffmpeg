import { audioArgs } from './audio';
import { describe, it, expect } from 'bun:test';


describe('audioArgs', () => {
    it('should generate arguments with all options', () => {
        const input = 'input.mp4';
        const output = 'output.mp3';
        const options = {
            codec: 'mp3',
            bitrate: '128k',
            channels: 2,
            frequency: 44100,
            quality: 5,
        } as const;

        const result = audioArgs(input, output, options);

        expect(result).toEqual([
            '-i', input,
            '-acodec', 'mp3',
            '-b:a', '128k',
            '-ac', '2',
            '-ar', '44100',
            '-q:a', '5',
            '-y', output,
        ]);
    });

    it('should generate arguments with only required options', () => {
        const input = 'input.mp4';
        const output = 'output.aac';
        const options = {
            codec: 'aac',
        } as const;

        const result = audioArgs(input, output, options);

        expect(result).toEqual([
            '-i', input,
            '-acodec', 'aac',
            '-y', output,
        ]);
    });

    it('should generate arguments with no options', () => {
        const input = 'input.mp4';
        const output = 'output.wav';

        const result = audioArgs(input, output);

        expect(result).toEqual([
            '-i', input,
            '-y', output,
        ]);
    });
});