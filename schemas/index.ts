import category from "./documentSchemas/category";
import contentBlock from "./documentSchemas/contentBlock";
import contentGroup from "./documentSchemas/contentGroup";
import crisisResource from "./documentSchemas/crisisResource";
import form from "./documentSchemas/form";
import homePage from "./documentSchemas/homePage";
import imageCollection from "./documentSchemas/imageCollection";
import imageSource from "./documentSchemas/imageSource";
import organization from "./documentSchemas/organization";
import person from "./documentSchemas/person";
import personGroup from "./documentSchemas/personGroup";
import population from "./documentSchemas/population";
import resourceEvaluation from "./documentSchemas/resourceEvaluation";
import smartCategory from "./documentSchemas/smartCategory";
import smartCollection from "./documentSchemas/smartCollection";
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
import coreValue from "./objectSchemas/coreValue";
import customResourceCollection from "./objectSchemas/customResourceCollection";
import featuredCrisisResource from "./objectSchemas/featuredCrisisResource";
import featuredResource from "./objectSchemas/featuredResource";
import featuredResources from "./objectSchemas/featuredResources";
import featuredWebsite from "./objectSchemas/featuredWebsite";
import featuredWebsites from "./objectSchemas/featuredWebsites";
import formField from "./objectSchemas/formField";
import headingText from "./objectSchemas/headingText";
import imageRow from "./objectSchemas/imageRow";
import link from "./objectSchemas/link";
import logo from "./objectSchemas/logo";
import pageLinks from "./objectSchemas/pageLinks";
import personGroupBlock from "./objectSchemas/personGroupBlock";
import relativeLink from "./objectSchemas/relativeLink";
import resourceLinks from "./objectSchemas/resourceLinks";
import resourcePageLink from "./objectSchemas/resourcePageLink";
import richTextContentBlock from "./objectSchemas/richTextContentBlock";
import smartCollectionLink from "./objectSchemas/smartCollectionLink";
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
  customResourceCollection,
  featuredCrisisResource,
  featuredResource,
  featuredResources,
  featuredWebsite,
  featuredWebsites,
  formField,
  headingText,
  imageRow,
  link,
  logo,
  pageLinks,
  personGroupBlock,
  relativeLink,
  resourceLinks,
  resourcePageLink,
  richTextContentBlock,
  smartCollectionLink,
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
  crisisResource,
  form,
  imageCollection,
  imageSource,
  person,
  personGroup,
  population,
  resourceEvaluation,
  smartCategory,
  smartCollection,
  topicCollection,
  website,
];

export const singletonDocumentTypes = [organization, homePage];

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
