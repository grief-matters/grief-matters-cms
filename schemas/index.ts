import {
  aboutPage,
  category,
  crisisResource,
  featuredContent,
  homePage,
  imageCollection,
  imageSource,
  organization,
  featuredTopics,
  person,
  population,
  website,
  smartCategory,
  topicCollection,
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
  link,
  logo,
  resourceLinks,
  resourcePageLink,
  resourcePageLinks,
  richTextContentBlock,
  rowOfThree,
  rowOfThreeFeaturedResources,
  telephoneNumber,
  topicCollectionContentBlock,
} from "./objectSchemas";

export const objectTypes = [
  accessibleImage,
  availability,
  coreValue,
  customResourceCollection,
  link,
  logo,
  resourceLinks,
  resourcePageLink,
  resourcePageLinks,
  richTextContentBlock,
  rowOfThree,
  rowOfThreeFeaturedResources,
  telephoneNumber,
  topicCollectionContentBlock,
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

export const documentTypes = [
  category,
  topicCollection,
  smartCategory,
  crisisResource,
  population,
  website,
  featuredContent,
  imageSource,
  imageCollection,
  person,
];

export const singletonDocumentTypes = [
  organization,
  featuredTopics,
  homePage,
  aboutPage,
];

export const SINGLETON_TYPES = new Set([
  "organization",
  "featuredTopics",
  "homePage",
  "aboutPage",
]);

export const schemaTypes = [
  ...singletonDocumentTypes,
  ...objectTypes,
  ...internetResourceDocumentTypes,
  ...documentTypes,
];
