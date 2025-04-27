// stop.ts
import { Itinery } from './itinerary';
import { HeritageSite } from './heritage-site';

export interface Stop {
    id: number;
    order: number;
    duration: string;
    itineryId?: number; // This is used for our frontend communication
    itinery?: Itinery; // This matches the backend's Entity structure
    heritageSite?: HeritageSite; // This matches the backend's Entity structure
}
