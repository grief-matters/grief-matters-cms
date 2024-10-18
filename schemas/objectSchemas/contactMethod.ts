import { defineField, defineType } from "sanity";

const contactTypes = ["email", "tel", "sms", "liveChat"] as const;

const contactTypesLabels: Record<(typeof contactTypes)[number], string> = {
  email: "Email",
  tel: "Telephone",
  sms: "SMS",
  liveChat: "Live Chat Service",
};

export default defineType({
  type: "object",
  name: "contactMethod",
  description: "A contact method is made up of ",
  preview: {
    select: {
      type: "contactType",
    },
    prepare: ({ type }) => ({
      title: contactTypesLabels[type as (typeof contactTypes)[number]],
    }),
  },
  fields: [
    defineField({
      name: "contactType",
      title: "ContactType",
      type: "string",
      options: {
        list: Object.entries(contactTypesLabels).map(([value, title]) => ({
          value,
          title,
        })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "telephoneNumber",
      title: "Telephone Number",
      description:
        "Enter the telephone number. Any common format is acceptable.",
      type: "string",
      hidden: ({ parent }) =>
        parent?.contactType !== "tel" && parent?.contactType !== "sms",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { parent } = context;

          if (
            (parent as any)?.contactType === "tel" ||
            (parent as any)?.contactType === "sms"
          ) {
            return typeof value === "string" && value.trim() !== ""
              ? true
              : "A telephone number is required for telephone or SMS contact methods";
          }
          return true;
        }),
    }),
    defineField({
      name: "email",
      title: "Email Address",
      description:
        "Enter a valid email address. You do not need to include any 'mailto:' prefix",
      type: "email",
      hidden: ({ parent }) => parent?.contactType !== "email",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { parent } = context;

          if ((parent as any)?.contactType === "email") {
            return typeof value === "string" && value.trim() !== ""
              ? true
              : "An email address is required for email contact methods";
          }
          return true;
        }),
    }),
    defineField({
      name: "liveChatUrl",
      title: "LiveChat URL",
      description: "The URL that takes them directly to the Live Chat service",
      type: "url",
      hidden: ({ parent }) => parent?.contactType !== "liveChat",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { parent } = context;

          if ((parent as any)?.contactType === "liveChat") {
            return typeof value === "string" && value.trim() !== ""
              ? true
              : "A URL is required for live chat contact methods";
          }
          return true;
        }),
    }),
    defineField({
      name: "availability",
      type: "availability",
      title: "Availability",
      hidden: ({ parent }) => parent?.contactType === "email",
    }),
  ],
});
