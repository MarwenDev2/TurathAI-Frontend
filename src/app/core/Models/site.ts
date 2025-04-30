export interface Site {
    id: number;
    name: string;
    location: string;
    description: string;
    historicalSignificance: string;
    popularityScore: number;
    categoryId: number;
    expectedPopularity: 'Low' | 'Medium' | 'High';
    imageIds?: number[];
    averageRating?: number;
  }
  