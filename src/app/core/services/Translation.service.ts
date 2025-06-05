import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly apiGatewayUrl = environment.apiUrl;           // Spring Boot (8080)
  private readonly aiServiceUrl = environment.apiTranslationUrl; // Python AI (8001)

  constructor(private http: HttpClient) {}

  // ✅ This hits Python on port 8001
  translateText(text: string, targetLanguage: string): Observable<string> {
    return this.http.post<{ translated_text: string }>(
      `${this.aiServiceUrl}/translate`,
      { text, target_language: targetLanguage }
    ).pipe(map(response => response.translated_text));
  }

  // ✅ Also Python on port 8001
  generateSpeech(text: string, language: string): Observable<Blob> {
    return this.http.post(
      `${this.aiServiceUrl}/generate-voice`,
      { text, language },
      { responseType: 'blob' }
    );
  }

  // ✅ Also Python on port 8001
  generateSpeechWithUser(text: string, userId: number): Observable<Blob> {
    return this.http.post(
      `${this.aiServiceUrl}/generate-voice`,
      { text, user_id: userId },
      { responseType: 'blob' }
    );
  }

  // ✅ This one goes to Spring Boot on port 8080
  generateNarrationWithUserEmail(text: string, userEmail: string): Observable<Blob> {
    return this.http.post(
      `${this.apiGatewayUrl}/api/narration/voice`,
      { text },
      {
        responseType: 'blob',
        headers: { 'X-User-Email': userEmail }
      }
    );
  }

  getBrowserLanguage(): string {
    return navigator.language.split('-')[0];
  }

  getVoiceName(languageCode: string): string | null {
    const languageMap: { [key: string]: string } = {
      'en': 'english',
      'fr': 'french',
      'ar': 'arabic',
      'es': 'spanish',
      'de': 'german'
    };
    return languageMap[languageCode] || null;
  }
}
