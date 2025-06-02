import { Site } from './site';
import { ImageData } from './event';

export interface Business {
  id?: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  contact: string;
  heritageSite?: Site;
  images?: ImageData[];
  imageIds?: number[];
  // Additional properties for enhanced business detail page
  description?: string;
  location?: string;
  email?: string;
  website?: string;
  hours?: string;
  about?: string;
}
