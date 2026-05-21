import groq from "groq";
import { SanityClient } from "@sanity/client";
import type { RefDocs } from "./types";

export function fetchReferenceTaxonomies(
  sanity: SanityClient
): Promise<RefDocs> {
  return sanity.fetch(groq`{
    "lossRelationship": *[_type == 'lossRelationship']{_id, title, "description": shortDescription},
    "causeOfDeath": *[_type == 'causeOfDeath']{_id, title, "description": shortDescription},
    "theme": *[_type == 'theme']{_id, title, "description": shortDescription},
    "demographic": *[_type == 'demographic']{_id, title, description},
    "griefPhase": *[_type == 'griefPhase']{_id, title, description},
    "griefType": *[_type == 'griefType']{_id, title, description},
    "emotionalState": *[_type == 'emotionalState']{_id, title, description},
    "contentFunction": *[_type == 'contentFunction']{_id, title, description},
  }`);
}
