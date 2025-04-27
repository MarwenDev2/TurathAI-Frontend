export interface Site {
    id: number;
    name: string;
    location: string;
    description: string;
    historicalSignificance: string;
    popularityScore: number;
    categoryId: number;
    imageIds?: number[];
    averageRating?: number;
  }
  