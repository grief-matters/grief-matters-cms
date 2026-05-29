export const contactTypes = [
  "email",
  "contactForm",
  "tel",
  "tty",
  "sms",
  "liveChat",
] as const;
export type ContactType = (typeof contactTypes)[number];
