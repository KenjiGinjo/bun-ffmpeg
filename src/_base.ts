import { extractError } from "./utils/extractError";

export const _spawn = async (args: string[]) => {
    const proc = Bun.spawn(['ffmpeg', ...args], {
        stderr: "pipe",
    });


    const exitCode = await proc.exited;

    if (exitCode !== 0) {
        const stderr = await Bun.readableStreamToText(proc.stderr);
        const errors = extractError(stderr);
        throw new Error(errors);
    }
}

