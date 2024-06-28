export function extractError(stderr: string): string {
  return stderr
    .split(/\r\n|\r|\n/g)
    .filter(message => message.charAt(0) !== ' ' && message.charAt(0) !== '[')
    .join('\n')
}
