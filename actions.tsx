import { useState } from "react";
import { startCase } from "lodash";

import {
  DocumentActionModalDialogProps,
  DocumentActionProps,
  useClient,
} from "sanity";
import { Box, Button, Flex, Inline, Select, Stack, Text } from "@sanity/ui";
import { useRouter } from "sanity/router";

import { INTERNET_RESOURCE_TYPES } from "./constants";
import { InternetResourceType, TypedMap } from "./types";

const apiVersion =
  String(process.env.SANITY_STUDIO_API_VERSION) ||
  new Date(Date.now()).toISOString().split("T")[0];

const resourceNameKeyMap: TypedMap<InternetResourceType> = {
  app: "name",
  article: "title",
  book: "title",
  blog: "title",
  crisisResource: "name",
  podcast: "name",
  podcastEpisode: "title",
  story: "title",
  forum: "name",
  peerSupportResource: "name",
  therapyResource: "name",
  memorial: "name",
};

function convertCamelCaseToSentence(value: string) {
  if (!value) return "";
  const withSpaces = value.replace(/([A-Z])/g, " $1");
  return startCase(withSpaces);
}

export function ConvertAction(props: DocumentActionProps) {
  const client = useClient({ apiVersion: apiVersion });
  const router = useRouter();

  const options = [...INTERNET_RESOURCE_TYPES.filter((x) => x !== props.type)];

  const [newType, setNewType] = useState<InternetResourceType>(options[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConvert = () => {
    if (!newType || !props.published) return;

    const currentTypeNameKey =
      resourceNameKeyMap[props.type as InternetResourceType];

    const newTypeNameKey = resourceNameKeyMap[newType];

    const doc = {
      _type: newType,
      [newTypeNameKey]: props.published[currentTypeNameKey],
      description: props.published.description,
      resourceDetails: props.published.resourceDetails,
    };

    client.create(doc).then((doc) => {
      client.delete(props.id).then(() => {
        props.onComplete();

        const path = `/desk/${newType};${doc._id}`;
        router.navigateUrl({ path });
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
              <Text>
                Please select the type of resource that you wish to convert this{" "}
                <strong>{props.type}</strong> to:
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
                  />
                </Inline>
              </Flex>
            </Stack>
          </Box>
        ),
      } as DocumentActionModalDialogProps),
  };
}
