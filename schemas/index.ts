import category from "./documentSchemas/category";
import contentBlock from "./documentSchemas/contentBlock";
import contentGroup from "./documentSchemas/contentGroup";
import coreContentGroups from "./documentSchemas/coreContentGroups";
import crisisResource from "./documentSchemas/crisisResource";
import homePage from "./documentSchemas/homePage";
import imageCollection from "./documentSchemas/imageCollection";
import imageSource from "./documentSchemas/imageSource";
import organization from "./documentSchemas/organization";
import person from "./documentSchemas/person";
import personGroup from "./documentSchemas/personGroup";
import population from "./documentSchemas/population";
import resourceEvaluation from "./documentSchemas/resourceEvaluation";
import smartCategory from "./documentSchemas/smartCategory";
import topicCollection from "./documentSchemas/topicCollection";
import website from "./documentSchemas/website";

import app from "./internetResourceDocumentSchemas/app";
import article from "./internetResourceDocumentSchemas/article";
import blog from "./internetResourceDocumentSchemas/blog";
import book from "./internetResourceDocumentSchemas/book";
import booklet from "./internetResourceDocumentSchemas/booklet";
import brochure from "./internetResourceDocumentSchemas/brochure";
import course from "./internetResourceDocumentSchemas/course";
import forum from "./internetResourceDocumentSchemas/forum";
import memorial from "./internetResourceDocumentSchemas/memorial";
import peerSupport from "./internetResourceDocumentSchemas/peerSupport";
import podcast from "./internetResourceDocumentSchemas/podcast";
import podcastEpisode from "./internetResourceDocumentSchemas/podcastEpisode";
import story from "./internetResourceDocumentSchemas/story";
import supportGroup from "./internetResourceDocumentSchemas/supportGroup";
import therapyResource from "./internetResourceDocumentSchemas/therapyResource";
import video from "./internetResourceDocumentSchemas/video";
import webinar from "./internetResourceDocumentSchemas/webinar";

import accessibleImage from "./objectSchemas/accessibleImage";
import availability from "./objectSchemas/availability";
import contactMethod from "./objectSchemas/contactMethod";
import coreContentGroup from "./objectSchemas/coreContentGroup";
import coreValue from "./objectSchemas/coreValue";
import customResourceCollection from "./objectSchemas/customResourceCollection";
import featuredCrisisResource from "./objectSchemas/featuredCrisisResource";
import featuredResource from "./objectSchemas/featuredResource";
import featuredWebsite from "./objectSchemas/featuredWebsite";
import imageRow from "./objectSchemas/imageRow";
import link from "./objectSchemas/link";
import logo from "./objectSchemas/logo";
import relativeLink from "./objectSchemas/relativeLink";
import resourceLinks from "./objectSchemas/resourceLinks";
import resourcePageLink from "./objectSchemas/resourcePageLink";
import resourcePageLinks from "./objectSchemas/resourcePageLinks";
import richTextContentBlock from "./objectSchemas/richTextContentBlock";
import rowOfThree from "./objectSchemas/rowOfThree";
import rowOfThreeFeaturedResources from "./objectSchemas/rowOfThreeFeaturedResources";
import socials from "./objectSchemas/socials";
import telephoneNumber from "./objectSchemas/telephoneNumber";
import topicCollectionContentBlock from "./objectSchemas/topicCollectionContentBlock";
import topicCollectionContentBlockNew from "./objectSchemas/topicCollectionContentBlockNew";
import topicContentBlock from "./objectSchemas/topicContentBlock";

export const objectTypes = [
  accessibleImage,
  availability,
  contactMethod,
  coreValue,
  coreContentGroup,
  customResourceCollection,
  featuredCrisisResource,
  featuredResource,
  featuredWebsite,
  imageRow,
  link,
  logo,
  relativeLink,
  resourceLinks,
  resourcePageLink,
  resourcePageLinks,
  richTextContentBlock,
  rowOfThree,
  rowOfThreeFeaturedResources,
  socials,
  telephoneNumber,
  topicContentBlock,
  topicCollectionContentBlock,
  topicCollectionContentBlockNew,
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
  contentBlock,
  contentGroup,
  topicCollection,
  smartCategory,
  crisisResource,
  population,
  website,
  imageSource,
  imageCollection,
  person,
  personGroup,
  resourceEvaluation,
];

export const singletonDocumentTypes = [
  organization,
  homePage,
  coreContentGroups,
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
