export interface DocMetadata {
  id: string;
  title: string;
  order: number;
}

export interface Doc extends DocMetadata {
  content: string;
}
