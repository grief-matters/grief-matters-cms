// ANSI escapes render in `wrangler tail` / local dev. The Cloudflare Workers
// Logs dashboard renders them as literal characters — fine, just less pretty.
const colors = {
  info: "\x1b[36m", // cyan
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
} as const;
const reset = "\x1b[0m";

type Level = keyof typeof colors;

const consoles: Record<Level, (...args: unknown[]) => void> = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};

function write(level: Level, event: string, message: string | unknown) {
  const tag = `${colors[level]}[${event}]${reset}:`;
  const text = typeof message === "string" ? message : JSON.stringify(message);
  consoles[level](tag, text);
}

export const logger = {
  info: (event: string, message: string | unknown) =>
    write("info", event, message),
  warn: (event: string, message: string | unknown) =>
    write("warn", event, message),
  error: (event: string, message: string | unknown) =>
    write("error", event, message),
};
