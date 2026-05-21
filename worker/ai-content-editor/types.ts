export type DocType =
  | "lossRelationship"
  | "causeOfDeath"
  | "theme"
  | "demographic"
  | "griefPhase"
  | "griefType"
  | "emotionalState"
  | "contentFunction";

export type RefDoc = {
  _id: string;
  title: string;
  description: string;
};

export type RefDocs = Record<DocType, RefDoc[]>;
