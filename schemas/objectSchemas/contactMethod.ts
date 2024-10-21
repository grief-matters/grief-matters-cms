import { defineArrayMember, defineField, defineType } from "sanity";

const contactTypes = [
  "email",
  "contactForm",
  "tel",
  "tty",
  "sms",
  "liveChat",
] as const;

const contactTypesLabels: Record<(typeof contactTypes)[number], string> = {
  email: "Email",
  contactForm: "Contact Form",
  tel: "Telephone",
  sms: "SMS",
  liveChat: "Live Chat Service",
  tty: "TTY",
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
        "Enter a number as you would dial it. This ensures it will connect to the correct number when the user clicks the link.",
      type: "string",
      hidden: ({ parent }) =>
        parent?.contactType !== "tel" &&
        parent?.contactType !== "tty" &&
        parent?.contactType !== "sms",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { parent } = context;

          if (
            (parent as any)?.contactType === "tel" ||
            (parent as any)?.contactType === "sms" ||
            (parent as any)?.contactType === "tty"
          ) {
            return typeof value === "string" && value.trim() !== ""
              ? true
              : "A telephone number is required for telephone or SMS contact methods";
          }
          return true;
        }),
    }),
    defineField({
      name: "tty",
      title: "TTY",
      description:
        "Enter a number as you would dial it. This ensures it will connect to the correct number when the user clicks the link.",
      type: "string",
      hidden: ({ parent }) =>
        parent?.contactType !== "tel" &&
        parent?.contactType !== "tty" &&
        parent?.contactType !== "sms",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { parent } = context;

          if (
            (parent as any)?.contactType === "tel" ||
            (parent as any)?.contactType === "tty" ||
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
      name: "smsBody",
      type: "string",
      title: "SMS Content",
      description: `Enter a predefined word that the user has to text to initiate the service e.g. for TeenLine they say "Text TEEN to 839863", so enter TEEN here`,
      hidden: ({ parent }) => parent?.contactType !== "sms",
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
      name: "contactForm",
      title: "Contact Form",
      description: "The URL for the contact form",
      type: "url",
      hidden: ({ parent }) => parent?.contactType !== "contactForm",
      validation: (rule) =>
        rule.custom((value, context) => {
          const { parent } = context;

          if ((parent as any)?.contactType === "contactForm") {
            return typeof value === "string" && value.trim() !== ""
              ? true
              : "A URL is required for a contact form";
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
      name: "availabilities",
      type: "array",
      of: [defineArrayMember({ type: "availability" })],
      title: "Availability",
      hidden: ({ parent }) =>
        parent?.contactType === "email" ||
        parent?.contactType === "contactForm",
    }),
  ],
});
