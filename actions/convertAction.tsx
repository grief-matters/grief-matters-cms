import { useState } from "react";

import { startCase } from "lodash";

import {
  DocumentActionModalDialogProps,
  DocumentActionProps,
  useClient,
} from "sanity";
import {
  Box,
  Button,
  Card,
  Flex,
  Inline,
  Select,
  Stack,
  Text,
  useToast,
} from "@sanity/ui";
import { useRouter } from "sanity/router";

import { InternetResourceType, TypedMap } from "../types";
import { INTERNET_RESOURCE_TYPES } from "../constants";

const apiVersion =
  String(process.env.SANITY_STUDIO_API_VERSION) ||
  new Date(Date.now()).toISOString().split("T")[0];

const resourceNameKeyMap: TypedMap<InternetResourceType> = {
  app: "name",
  article: "title",
  blog: "title",
  book: "title",
  booklet: "title",
  brochure: "title",
  course: "title",
  forum: "name",
  memorial: "name",
  peerSupport: "name",
  podcast: "name",
  podcastEpisode: "title",
  story: "title",
  therapyResource: "name",
  video: "title",
  webinar: "title",
  supportGroup: "name",
  community: "title",
  printedMaterial: "title",
};

function convertCamelCaseToSentence(value: string) {
  if (!value) return "";
  const withSpaces = value.replace(/([A-Z])/g, " $1");
  return startCase(withSpaces);
}

export function ConvertAction(props: DocumentActionProps) {
  const toast = useToast();
  const client = useClient({ apiVersion: apiVersion });
  const router = useRouter();

  const options = [...INTERNET_RESOURCE_TYPES.filter((x) => x !== props.type)];

  const [newType, setNewType] = useState<InternetResourceType>(options[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [converting, setConverting] = useState(false);

  const handleConvert = () => {
    setConverting(true);

    const currentTypeNameKey =
      resourceNameKeyMap[props.type as InternetResourceType];

    const newTypeNameKey = resourceNameKeyMap[newType];

    // we don't have a published document if we get this far - so draft has to be defined
    const doc = {
      _id: "drafts.",
      _type: newType,
      [newTypeNameKey]: props.draft![currentTypeNameKey],
      description: props.draft?.description,
      categories: props.draft?.categories,
      populations: props.draft?.populations,
      resourceUrl: props.draft?.resourceUrl,
      sourceWebsite: props.draft?.sourceWebsite,
      rating: props.draft?.rating,
    };

    client
      .create(doc)
      .then((doc) => {
        toast.push({
          status: "success",
          title: `Successfully created new ${doc._type}!`,
        });
        client
          .delete(`drafts.${props.id}`)
          .then(() => {
            toast.push({
              status: "success",
              title: `Successfully deleted old ${props.type}!`,
            });

            props.onComplete();

            const path = `/desk/${newType};${doc._id}`;
            router.navigateUrl({ path });
          })
          .catch(() => {
            toast.push({
              status: "error",
              title: `Problem deleting old ${props.type}! You may need to delete the old resource manually`,
            });
          });
      })
      .catch(() => {
        toast.push({
          status: "error",
          title: `Could not create ${doc._id}! Try again or create the document manually`,
        });
      });
  };

  return {
    label: "Convert Resource",
    onHandle: () => {
      setDialogOpen(true);
    },
    title: "Convert a resource to another type",
    dialog:
      dialogOpen &&
      ({
        type: "dialog",
        onClose: props.onComplete,
        header: "Convert Resource To Another Type",
        content: (
          <Box padding={4}>
            <Stack space={5}>
              {props.published ? (
                <>
                  <Text>
                    The resource must be <strong>Unpublished</strong> before you
                    can convert it.
                  </Text>
                </>
              ) : (
                <>
                  <Text>
                    Please select the type of resource that you wish to convert
                    this <strong>{props.type}</strong> to:
                  </Text>

                  <Select
                    value={newType}
                    onChange={(e) =>
                      setNewType(
                        (e.target as HTMLSelectElement)
                          .value as InternetResourceType
                      )
                    }
                  >
                    {options.map((option, i) => (
                      <option key={`${i}--${option}`} value={option}>
                        {convertCamelCaseToSentence(option)}
                      </option>
                    ))}
                  </Select>
                  <Card
                    padding={[3, 3, 4]}
                    radius={2}
                    shadow={1}
                    tone="caution"
                  >
                    <Text>
                      Only fields common to all resource types will be copied
                      across. For example, if you are converting a <em>book</em>{" "}
                      to an <em>article</em> you may lose information such as{" "}
                      <em>ISBN</em> and <em>author</em>
                    </Text>
                  </Card>
                  <Flex justify="flex-end">
                    <Inline space={[3, 3, 4]}>
                      <Button
                        mode="ghost"
                        padding={[2, 2, 3]}
                        text="Cancel"
                        onClick={props.onComplete}
                      />
                      <Button
                        padding={[2, 2, 3]}
                        text={`Convert to ${startCase(newType)}`}
                        tone="primary"
                        onClick={handleConvert}
                        disabled={converting}
                      />
                    </Inline>
                  </Flex>
                </>
              )}
            </Stack>
          </Box>
        ),
      } as DocumentActionModalDialogProps),
  };
}
