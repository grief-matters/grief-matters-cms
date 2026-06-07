import { defineField } from "sanity";

export default defineField({
  name: "supportedGriever",
  title: "Supported Griever",
  type: "array",
  group: "classification",
  description: "Describes attributes of the bereaved person being supported",
  of: [{ type: "string" }],
  options: {
    list: [
      { title: "Child", value: "child" },
      { title: "Teen", value: "teen" },
    ],
  },
  hidden: ({ parent }) => {
    const roles: string[] = parent?.audienceRole ?? [];
    return !roles.includes("supporter") && !roles.includes("professional");
  },
});
