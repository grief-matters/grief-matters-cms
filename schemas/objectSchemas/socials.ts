import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "socials",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      description:
        "Ensure you have obtained consent before adding a person's email address",
      type: "email",
    }),
    // defineField({
    //   name: "x",
    //   title: "X (Twitter)",
    //   description: "X (Twitter) handle, you do not need to add the @ symbol",
    //   type: "string",
    //   validation: (rule) =>
    //     rule.regex(/^[A-Za-z0-9_]{1,15}$/, {
    //       name: "Valid X handle (without @)",
    //     }),
    // }),
    defineField({
      name: "linkedIn",
      title: "Linked In",
      description:
        "Full URL to Linked In profile e.g. 'https://www.linkedin.com/in/my-profile'",
      type: "string",
      validation: (rule) =>
        rule.regex(
          /^https:\/\/(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9-]+\/?|company\/[a-zA-Z0-9-]+\/?|groups\/[0-9]+\/?|feed\/update\/urn:li:activity:[0-9]+\/?)$/,
          { name: "Valid LinkedIn" }
        ),
    }),
  ],
});
