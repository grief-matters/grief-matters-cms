import {
  category,
  crisisResource,
  organization,
  person,
  population,
  website,
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
  logo,
  telephoneNumber,
  resourceBase,
} from "./objectSchemas";

export const objectTypes = [
  accessibleImage,
  availability,
  coreValue,
  logo,
  telephoneNumber,
  resourceBase,
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
  crisisResource,
  person,
  population,
  website,
];

export const singletonDocumentTypes = [organization];

export const SINGLETON_TYPES = new Set(["organization"]);

export const schemaTypes = [
  ...singletonDocumentTypes,
  ...objectTypes,
  ...internetResourceDocumentTypes,
  ...documentTypes,
];
