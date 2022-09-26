export class LocationMapping {
  id: string;

  title: string;

  description: string;

  hashtags: string[];

  category: string;

  activities: string[];

  seasons: string[];

  status: string;

  reviews: {
    description: string;
  }[];

  _score?: number;

  _source?: Omit<LocationMapping, "_score">;
}

export const location = {
  mappings: {
    properties: {
      id: { type: "keyword" },
      description: { type: "text" },
      title: { type: "text" },
      reviews: {
        type: "nested",
        properties: { description: { type: "text" } },
      },
      hashtags: { type: "keyword" },
      category: { type: "keyword" },
      activities: { type: "keyword" },
      seasons: { type: "keyword" },
      status: { type: "keyword" },
    },
  },
};
