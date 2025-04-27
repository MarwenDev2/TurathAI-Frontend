// site.ts
export interface Site {
    id: number;
    name: string;
    location: string;
    description: string;
    historicalSignificance: string;
    expectedPopularity: 'Low' | 'Medium' | 'High';
    popularityScore: number;
    categoryId: number;
    imageIds?: number[];
    averageRating?: number;
  }
  