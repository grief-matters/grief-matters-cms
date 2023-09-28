import { defineField } from "sanity";
import { RatingInput } from "../../components";

export default defineField({
  title: "Rating",
  name: "rating",
  type: "number",
  description: "Rate the resource from 1 to 10 (10 being best)",
  options: {
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    layout: "radio",
    direction: "horizontal",
  },
  validation: (Rule) => Rule.min(1).max(10).integer(),
  components: {
    input: RatingInput,
  },
});
