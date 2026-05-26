export function logMessage(event: string, message: string | unknown) {
  if (typeof message === "string") {
    console.log(`[${event}]: `, message);
    return;
  }
  console.log(`[${event}]: `, JSON.stringify(message));
}
