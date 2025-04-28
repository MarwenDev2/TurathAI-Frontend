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
}
