import { defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons";

import { AvailabilityPreview, TimeInput } from "../../components";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timezones = ["Eastern", "Central", "Mountain", "Pacific"];

export default defineType({
  type: "object",
  name: "availability",
  title: "Availability",
  icon: ClockIcon,
  components: { preview: AvailabilityPreview },
  preview: {
    select: {
      days: "days",
      from: "availableFrom",
      to: "availableTo",
      timezone: "timezone",
    },
  },
  fields: [
    defineField({
      name: "days",
      title: "Days",
      description: "Select days of the week",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: days,
      },
      initialValue: [...days],
    }),
    defineField({
      name: "availableFrom",
      title: "From",
      type: "string",
      components: { input: TimeInput },
      initialValue: "00:00",
    }),
    defineField({
      name: "availableTo",
      title: "To",
      type: "string",
      components: { input: TimeInput },
      initialValue: "00:00",
    }),
    defineField({
      name: "timezone",
      title: "Timezone",
      type: "string",
      options: {
        list: timezones,
      },
    }),
  ],
});
