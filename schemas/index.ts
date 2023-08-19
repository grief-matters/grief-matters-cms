import {
  app,
  article,
  blog,
  book,
  booklet,
  brochure,
  category,
  crisisResource,
  website,
  organization,
} from "./documentSchemas";
import {
  course,
  forum,
  memorial,
  peerSupport,
  person,
  podcast,
  podcastEpisode,
  population,
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
  story,
  therapyResource,
  video,
  webinar,
  forum,
  memorial,
  peerSupport,
  podcast,
  podcastEpisode,
  supportGroup,
];

export const INTERNET_RESOURCE_TYPES = internetResourceDocumentTypes.map(
  (t) => t.name
);

export const documentTypes = [
  category,
  crisisResource,
  website,
  person,
  population,
];

export const singletonDocumentTypes = [organization];

export const SINGLETON_TYPES = new Set(["organization"]);

export const schemaTypes = [
  ...singletonDocumentTypes,
  ...objectTypes,
  ...internetResourceDocumentTypes,
  ...documentTypes,
];
