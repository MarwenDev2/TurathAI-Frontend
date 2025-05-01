import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UrlPersistenceService {
  private readonly URL_STORAGE_KEY = 'last_url';

  constructor(private router: Router) {
    // Subscribe to router events to track URL changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Save the current URL to local storage
      if (!event.url.includes('/auth/')) {
        localStorage.setItem(this.URL_STORAGE_KEY, event.url);
      }
    });
  }

  /**
   * Get the last saved URL from local storage
   */
  getLastUrl(): string | null {
    return localStorage.getItem(this.URL_STORAGE_KEY);
  }

  /**
   * Restore navigation to the last saved URL
   * @returns true if navigation was restored, false otherwise
   */
  restoreLastUrl(): boolean {
    const lastUrl = this.getLastUrl();
    if (lastUrl) {
      this.router.navigateByUrl(lastUrl);
      return true;
    }
    return false;
  }

  /**
   * Clear the stored URL
   */
  clearStoredUrl(): void {
    localStorage.removeItem(this.URL_STORAGE_KEY);
  }
}
