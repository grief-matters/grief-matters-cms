export function logMessage(event: string, message: string | unknown) {
  if (typeof message === "string") {
    console.log(`[${event}]: \n`, message);
    return;
  }
  console.log(`[${event}]: \n`, JSON.stringify(message));
}
