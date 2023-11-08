import {
  category,
  crisisResource,
  featurePanel,
  homePage,
  imageSource,
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
  categoryLink,
  categoryLinks,
  coreValue,
  customResourceCollection,
  link,
  logo,
  resourceLinks,
  rowOfThree,
  telephoneNumber,
} from "./objectSchemas";

export const objectTypes = [
  accessibleImage,
  availability,
  categoryLink,
  categoryLinks,
  coreValue,
  customResourceCollection,
  link,
  logo,
  resourceLinks,
  rowOfThree,
  telephoneNumber,
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
  population,
  website,
  featurePanel,
  imageSource,
  person,
];

export const singletonDocumentTypes = [organization, featuredTopics, homePage];

export const SINGLETON_TYPES = new Set([
  "organization",
  "featuredTopics",
  "homePage",
]);

export const schemaTypes = [
  ...singletonDocumentTypes,
  ...objectTypes,
  ...internetResourceDocumentTypes,
  ...documentTypes,
];
