import { CustomValidator, defineField } from "sanity";
import ResourceUrlInput from "../../components/ResourceUrlInput";

const internetResourceTypeNames = [
  "app",
  "article",
  "blog",
  "book",
  "community",
  "course",
  "forum",
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
];

const isUniqueUrl: CustomValidator<string | undefined> = async (
  url,
  context
) => {
  if (!url) return true;

  const { document, getClient } = context;
  const client = getClient({
    apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
  });
  const id = document?._id?.replace(/^drafts\./, "");

  if (!id) return true;

  const params = {
    draft: `drafts.${id}`,
    published: id,
    url,
    types: internetResourceTypeNames,
  };

  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    _type in $types &&
    resourceUrl == $url
  ][0]._id)`;

  const isUnique = await client.fetch(query, params);
  return isUnique || "This URL is already used by another resource";
};

const urlField = defineField({
  title: "URL",
  description:
    "This should be a valid web address, usually starting with 'https://'",
  name: "resourceUrl",
  type: "url",
  components: {
    input: ResourceUrlInput,
  },
  validation: (Rule) => Rule.custom(isUniqueUrl),
});

export const requiredUrlField = defineField({
  ...urlField,
  validation: (Rule) => Rule.required().custom(isUniqueUrl),
});

export default urlField;
