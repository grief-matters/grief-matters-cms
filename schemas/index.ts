import {
  category,
  crisisResource,
  organization,
  featuredTopics,
  person,
  population,
  website,
  smartCategory,
} from "./documentSchemas";
import {
  app,
  article,
  blog,
  book,
  booklet,
  brochure,
  course,
  forum,
  memorial,
  peerSupport,
  podcast,
  podcastEpisode,
  story,
  supportGroup,
  therapyResource,
  video,
  webinar,
} from "./internetResourceDocumentSchemas";
import {
  accessibleImage,
  availability,
  coreValue,
  customResourceCollection,
  logo,
  telephoneNumber,
} from "./objectSchemas";

export const objectTypes = [
  accessibleImage,
  availability,
  coreValue,
  logo,
  telephoneNumber,
  customResourceCollection,
];

export const internetResourceDocumentTypes = [
  app,
  article,
  blog,
  book,
  booklet,
  brochure,
  course,
  forum,
  memorial,
  peerSupport,
  podcast,
  podcastEpisode,
  story,
  supportGroup,
  therapyResource,
  video,
  webinar,
];

export const INTERNET_RESOURCE_TYPES = internetResourceDocumentTypes.map(
  (t) => t.name
);

export const documentTypes = [
  category,
  smartCategory,
  crisisResource,
  person,
  population,
  website,
];

export const singletonDocumentTypes = [organization, featuredTopics];

export const SINGLETON_TYPES = new Set(["organization", "featuredTopics"]);

export const schemaTypes = [
  ...singletonDocumentTypes,
  ...objectTypes,
  ...internetResourceDocumentTypes,
  ...documentTypes,
];
