import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Site } from '../Models/site';

export interface AIRecommendation {
  id: number;
  score: number;
  name?: string;
  description?: string;
  period?: string;
  architectural_style?: string;
  connection?: {
    type: string;
    weight: number;
  };
}

export interface AIRecommendationResponse {
  status: string;
  site_id: number;
  recommendations: AIRecommendation[];
}

export interface SimilarSiteResponse {
  status: string;
  site_id: number;
  similar_sites: AIRecommendation[];
}

@Injectable({
  providedIn: 'root'
})
export class AIRecommendationService {
  private apiUrl = `${environment.apiUrl}/api/ai`;
  
  constructor(private http: HttpClient) {}

  /**
   * Get AI-powered site recommendations based on connections
   * @param siteId The ID of the heritage site to get recommendations for
   * @param limit Maximum number of recommendations to return
   */
  getRecommendations(siteId: number, limit: number = 5): Observable<AIRecommendation[]> {
    return this.http.get<any>(`${this.apiUrl}/connections/${siteId}?limit=${limit}`)
      .pipe(
        map(response => {
          console.log('AI response:', response);
          // Handle various response formats
          if (response && response.status === 'success') {
            // If response has recommendations array, use it
            if (Array.isArray(response.recommendations)) {
              return response.recommendations;
            }
            // If response has connections array, convert it
            else if (Array.isArray(response.connections)) {
              return response.connections.map((id: number) => ({
                id,
                score: 0.7,  // Default score
                name: `Site ${id}`,
                description: 'Loading description...'
              }));
            }
            // If we get an object with error, return empty array
            else if (response.error) {
              console.warn('AI service error:', response.error);
              return [];
            }
          }
          console.warn('Unexpected AI response format:', response);
          return [];
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Convert AI recommendations to Site objects for compatibility with existing components
   * @param recommendations The AI recommendations to convert
   */
  convertToSites(recommendations: AIRecommendation[]): Site[] {
    return recommendations.map(rec => {
      const site: Site = {
        id: rec.id,
        name: rec.name || 'Unknown Site',
        description: rec.description || 'No description available',
        historicalSignificance: rec.period || 'Unknown',
        location: 'Unknown location', // Default location
        categoryId: 1, // Default category
        popularityScore: Math.min(10, rec.score * 10), // Convert 0-1 score to 0-10 scale
        expectedPopularity: this.getPopularityLabel(rec.score)
      };
      return site;
    });
  }

  /**
   * Get a text label for popularity based on AI recommendation score
   * Maps to the Site model's expectedPopularity type
   */
  private getPopularityLabel(score: number): 'High' | 'Medium' | 'Low' {
    if (score >= 0.7) return 'High';
    if (score >= 0.4) return 'Medium';
    return 'Low';
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    console.error('AI Recommendation Error:', error);
    
    if (error.status === 0) {
      console.error('Network error or AI service is not running:', error.error);
    } else {
      console.error(`AI service returned code ${error.status}, body:`, error.error);
    }
    
    return throwError(() => new Error('AI recommendation service unavailable. Please try again later.'));
  }
}
