import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/chat`;

  constructor(private http: HttpClient) {}

  /**
   * Send a message to the AI chatbot
   * @param message The user's message
   * @returns Observable with the chat response
   */
  sendMessage(message: string): Observable<any> {
    // Format matches the backend controller's expected request format
    return this.http.post<any>(this.apiUrl, { message });
  }
  
  /**
   * Get chat history from local storage
   * @returns Array of chat messages
   */
  getChatHistory(): Array<{sender: string, message: string, timestamp: Date}> {
    const history = localStorage.getItem('turath_chat_history');
    return history ? JSON.parse(history) : [];
  }
  
  /**
   * Save a message to chat history in local storage
   * @param message The message object to save
   */
  saveChatMessage(message: {sender: string, message: string, timestamp: Date}): void {
    const history = this.getChatHistory();
    history.push(message);
    // Limit history to last 50 messages to prevent localStorage from getting too large
    if (history.length > 50) {
      history.shift();
    }
    localStorage.setItem('turath_chat_history', JSON.stringify(history));
  }
  
  /**
   * Clear chat history from local storage
   */
  clearChatHistory(): void {
    localStorage.removeItem('turath_chat_history');
  }
}
