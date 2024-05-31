import { describe, it, expect } from "bun:test";
import { audioInfo } from "./audio-info";
const input = `${import.meta.dir}/samples/input.mp3`;

describe("audio-info", () => {
  it("should return the correct audio info", async () => {
    const result = await audioInfo(input);
    expect(result).toEqual([
      {
        codec: "mp3",
        channels: 1,
        sampleRate: 24000,
        bitrate: "160000",
      },
    ]);
  });
});
