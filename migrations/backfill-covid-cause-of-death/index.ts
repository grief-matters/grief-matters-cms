import { at, defineMigration, set } from "sanity/migrate";

import { ALL_TARGET_IDS, COVID_CAUSE_OF_DEATH_ID } from "./targetIds";

type RefArrayMember = { _key: string; _type: "reference"; _ref: string };

const idLiteralList = ALL_TARGET_IDS.map((id) => `"${id}"`).join(",");

export default defineMigration({
  title:
    "Backfill COVID-19 causeOfDeath ref on internet resources that were previously tagged with COVID categories",
  filter: `_id in [${idLiteralList}]`,

  migrate: {
    async document(doc) {
      const existing =
        (doc.causesOfDeath as RefArrayMember[] | undefined) ?? [];

      if (existing.some((r) => r._ref === COVID_CAUSE_OF_DEATH_ID)) {
        return [];
      }

      const next: RefArrayMember[] = [
        ...existing,
        {
          _key: "covid-19",
          _type: "reference",
          _ref: COVID_CAUSE_OF_DEATH_ID,
        },
      ];

      return [at("causesOfDeath", set(next))];
    },
  },
});
