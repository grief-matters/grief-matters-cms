export const INTERNET_RESOURCE_TYPES = [
  "app",
  "article",
  "blog",
  "book",
  "community",
  "course",
  "externalOrg",
  "crisisResource",
  "forum",
  "listicle",
  "memorial",
  "peerSupport",
  "podcast",
  "podcastEpisode",
  "printedMaterial",
  "story",
  "supportGroup",
  "therapyResource",
  "video",
  "webinar",
] as const;

export const contactTypes = [
  "email",
  "contactForm",
  "tel",
  "tty",
  "sms",
  "liveChat",
] as const;

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const timezones = ["Eastern", "Central", "Mountain", "Pacific"] as const;
