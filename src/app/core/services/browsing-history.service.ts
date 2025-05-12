import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface BrowsingHistoryItem {
  siteId: number;
  timestamp: number;
}

interface UserBrowsingHistory {
  recentlyViewed: BrowsingHistoryItem[];
  lastSiteId?: number; // Most recently viewed site ID
}

@Injectable({
  providedIn: 'root'
})
export class BrowsingHistoryService {
  private readonly STORAGE_KEY = 'turathAI_browsing_history';
  private readonly MAX_HISTORY_ITEMS = 10;
  
  // Observable for the most recently viewed site ID
  private recentSiteSubject = new BehaviorSubject<number | undefined>(undefined);
  public recentSiteId$: Observable<number | undefined> = this.recentSiteSubject.asObservable();
  
  constructor(private authService: AuthService) {
    // Initialize from storage when service is created
    this.loadFromStorage();
    
    // Subscribe to auth changes to reset history when user changes
    this.authService.currentUser$.subscribe(() => {
      this.loadFromStorage();
    });
  }
  
  /**
   * Record that a user has viewed a heritage site
   * @param siteId The ID of the viewed heritage site
   */
  recordSiteView(siteId: number): void {
    if (!siteId) return;
    
    const history = this.getHistory();
    
    // Add the new view to history
    const newView: BrowsingHistoryItem = {
      siteId,
      timestamp: Date.now()
    };
    
    // Update last site ID
    history.lastSiteId = siteId;
    
    // Add to recently viewed list, removing duplicates
    history.recentlyViewed = history.recentlyViewed
      .filter(item => item.siteId !== siteId) // Remove existing entry for this site
      .concat([newView]) // Add new entry at end
      .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent first
      .slice(0, this.MAX_HISTORY_ITEMS); // Keep only most recent items
    
    // Save updated history
    this.saveToStorage(history);
    
    // Update the observable
    this.recentSiteSubject.next(siteId);
  }
  
  /**
   * Get the ID of the most recently viewed heritage site
   */
  getRecentSiteId(): number | undefined {
    return this.getHistory().lastSiteId;
  }
  
  /**
   * Get a list of recently viewed site IDs in order (most recent first)
   */
  getRecentlyViewedSiteIds(): number[] {
    return this.getHistory().recentlyViewed.map(item => item.siteId);
  }
  
  /**
   * Reset the browsing history
   */
  resetHistory(): void {
    const emptyHistory: UserBrowsingHistory = {
      recentlyViewed: []
    };
    this.saveToStorage(emptyHistory);
    this.recentSiteSubject.next(undefined);
  }
  
  /**
   * Get browsing history from storage
   */
  private getHistory(): UserBrowsingHistory {
    const storageKey = this.getStorageKey();
    const storedJson = localStorage.getItem(storageKey);
    
    if (!storedJson) {
      return { recentlyViewed: [] };
    }
    
    try {
      return JSON.parse(storedJson) as UserBrowsingHistory;
    } catch (e) {
      console.error('Error parsing browsing history:', e);
      return { recentlyViewed: [] };
    }
  }
  
  /**
   * Save browsing history to storage
   */
  private saveToStorage(history: UserBrowsingHistory): void {
    const storageKey = this.getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(history));
  }
  
  /**
   * Load browsing history from storage and update observables
   */
  private loadFromStorage(): void {
    const history = this.getHistory();
    this.recentSiteSubject.next(history.lastSiteId);
  }
  
  /**
   * Get storage key, which may include user ID if logged in
   */
  private getStorageKey(): string {
    const currentUser = this.authService.currentUser;
    // If user is logged in, use user-specific storage key
    if (currentUser) {
      return `${this.STORAGE_KEY}_user_${currentUser.id}`;
    }
    // Otherwise use anonymous key
    return `${this.STORAGE_KEY}_anonymous`;
  }
}
