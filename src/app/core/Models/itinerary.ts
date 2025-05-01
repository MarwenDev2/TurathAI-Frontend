// itinery.ts
export interface Itinery {
    id: number;
    title?: string;
    description: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    userId: number;
    imageUrl?: string;
    locations?: string;
    heritageSiteId?: number;
    rating?: number;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'canceled';
    createdAt?: Date;
    updatedAt?: Date;
}
