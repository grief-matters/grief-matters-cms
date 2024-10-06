import aboutPage from "./documentSchemas/aboutPage";
import category from "./documentSchemas/category";
import crisisResource from "./documentSchemas/crisisResource";
import featuredContent from "./documentSchemas/featuredContent";
import featuredTopics from "./documentSchemas/featuredTopics";
import homePage from "./documentSchemas/homePage";
import imageCollection from "./documentSchemas/imageCollection";
import imageSource from "./documentSchemas/imageSource";
import organization from "./documentSchemas/organization";
import person from "./documentSchemas/person";
import population from "./documentSchemas/population";
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
import coreValue from "./objectSchemas/coreValue";
import customResourceCollection from "./objectSchemas/customResourceCollection";
import link from "./objectSchemas/link";
import logo from "./objectSchemas/logo";
import resourceLinks from "./objectSchemas/resourceLinks";
import resourcePageLink from "./objectSchemas/resourcePageLink";
import resourcePageLinks from "./objectSchemas/resourcePageLinks";
import richTextContentBlock from "./objectSchemas/richTextContentBlock";
import rowOfThree from "./objectSchemas/rowOfThree";
import rowOfThreeFeaturedResources from "./objectSchemas/rowOfThreeFeaturedResources";
import telephoneNumber from "./objectSchemas/telephoneNumber";
import topicCollectionContentBlock from "./objectSchemas/topicCollectionContentBlock";

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
