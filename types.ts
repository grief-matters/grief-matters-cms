import { INTERNET_RESOURCE_TYPES } from "./schemas";

export type MapObject = { [index: string]: string };

export type TypedMap<T extends string> = { [K in T]: string };

export type InternetResourceType = (typeof INTERNET_RESOURCE_TYPES)[number];
