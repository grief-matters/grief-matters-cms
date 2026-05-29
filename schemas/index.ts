import causeOfDeath from "./documentSchemas/causeOfDeath";
import contentBlock from "./documentSchemas/contentBlock";
import contentFunction from "./documentSchemas/contentFunction";
import contentGroup from "./documentSchemas/contentGroup";
import crisisResource from "./internetResourceDocumentSchemas/crisisResource";
import demographic from "./documentSchemas/demographic";
import endorsement from "./documentSchemas/endorsement";

import form from "./documentSchemas/form";
import griefPhase from "./documentSchemas/griefPhase";
import griefType from "./documentSchemas/griefType";
import imageAsset from "./documentSchemas/imageAsset";
import imageCollection from "./documentSchemas/imageCollection";
import imageSource from "./documentSchemas/imageSource";
import lossRelationship from "./documentSchemas/lossRelationship";
import organization from "./documentSchemas/organization";
import person from "./documentSchemas/person";
import personGroup from "./documentSchemas/personGroup";
import resourceEvaluation from "./documentSchemas/resourceEvaluation";
import searchConfiguration from "./documentSchemas/searchConfiguration";
import emotionalState from "./documentSchemas/emotionalState";
import theme from "./documentSchemas/theme";
import wdynrnEntry from "./documentSchemas/wdynrnEntry";

import app from "./internetResourceDocumentSchemas/app";
import article from "./internetResourceDocumentSchemas/article";
import blog from "./internetResourceDocumentSchemas/blog";
import book from "./internetResourceDocumentSchemas/book";
import community from "./internetResourceDocumentSchemas/community";
import course from "./internetResourceDocumentSchemas/course";
import externalOrg from "./internetResourceDocumentSchemas/externalOrg";
import forum from "./internetResourceDocumentSchemas/forum";
import listicle from "./internetResourceDocumentSchemas/listicle";
import memorial from "./internetResourceDocumentSchemas/memorial";
import peerSupport from "./internetResourceDocumentSchemas/peerSupport";
import podcast from "./internetResourceDocumentSchemas/podcast";
import podcastEpisode from "./internetResourceDocumentSchemas/podcastEpisode";
import printedMaterial from "./internetResourceDocumentSchemas/printedMaterial";
import story from "./internetResourceDocumentSchemas/story";
import supportGroup from "./internetResourceDocumentSchemas/supportGroup";
import therapyResource from "./internetResourceDocumentSchemas/therapyResource";
import video from "./internetResourceDocumentSchemas/video";
import webinar from "./internetResourceDocumentSchemas/webinar";

import availability from "./objectSchemas/availability";
import contactMethod from "./objectSchemas/contactMethod";
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
import richTextWithHeading from "./objectSchemas/richTextWithHeading";
import socials from "./objectSchemas/socials";
import telephoneNumber from "./objectSchemas/telephoneNumber";
import type { InternetResourceType } from "../shared/internet-resource";
import type { SchemaTypeDefinition } from "sanity";

export const objectTypes = [
  availability,
  contactMethod,
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
  richTextWithHeading,
  socials,
  telephoneNumber,
];

const typedInternetResourceSchemaRecord: Record<
  InternetResourceType,
  SchemaTypeDefinition
> = {
  crisisResource,
  app,
  article,
  blog,
  book,
  community,
  course,
  externalOrg,
  forum,
  listicle,
  memorial,
  peerSupport,
  podcast,
  podcastEpisode,
  printedMaterial,
  story,
  supportGroup,
  therapyResource,
  video,
  webinar,
};

export const internetResourceDocumentSchemaTypes = Object.values(
  typedInternetResourceSchemaRecord,
);

export const documentTypes = [
  contentBlock,
  contentGroup,
  endorsement,
  form,
  imageAsset,
  imageCollection,
  imageSource,
  person,
  personGroup,
  resourceEvaluation,
  wdynrnEntry,
];

export const classificationDocumentTypes = [
  lossRelationship,
  causeOfDeath,
  theme,
  demographic,
  griefPhase,
  griefType,
  emotionalState,
  contentFunction,
];

export const singletonDocumentTypes = [organization, searchConfiguration];

export const schemaTypes = [
  ...singletonDocumentTypes,
  ...objectTypes,
  ...internetResourceDocumentSchemaTypes,
  ...documentTypes,
  ...classificationDocumentTypes,
];
