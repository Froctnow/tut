export class SearchRequest {
  body: {
    min_score: number;
    query: {
      bool: {
        should?: any[];
        must?: {
          bool?: {
            should?: any[];
          };
        };
        filter: any[];
      };
    };
  };

  from: number;

  size: number;
}
