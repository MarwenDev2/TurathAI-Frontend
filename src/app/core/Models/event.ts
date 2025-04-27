import { Image } from "./image";
import { Site } from "./site";

export interface ImageData {
  id: number;
  name: string;
  url: string;
  type: string;
}

export interface EventSite {
  id?: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  site?: Site;          // Optional as sometimes it might be heritageSite
  heritageSite?: Site;  // From backend it comes as heritageSite
  imageIds?: number[];  // For the frontend to use if needed
  images?: ImageData[]; // From backend it comes as images array
}