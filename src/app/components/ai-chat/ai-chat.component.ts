import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '@core/services/chat.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  isChatOpen = false;
  showTooltip = false;
  showInitialNotification = true;
  message = '';
  isLoading = false;
  messages: Array<{sender: string, message: string, timestamp: Date}> = [];
  
  constructor(private chatService: ChatService) {}
  
  ngOnInit(): void {
    // Load chat history from local storage
    this.messages = this.chatService.getChatHistory();
    
    // Add a welcome message if there are no messages
    if (this.messages.length === 0) {
      this.addMessage('bot', 'مرحبا! Welcome to TurathAI Assistant! How can I help you explore Tunisian heritage, local experiences, or cultural events today? You can ask me about heritage sites, traditional crafts, local cuisine, or guided itineraries.');
    }
    
    // Show the notification badge for a few seconds to grab attention
    // then automatically hide it after 8 seconds
    setTimeout(() => {
      this.showInitialNotification = false;
    }, 8000);
  }
  
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    // Check if the chat is open and the click is outside the chat container and button
    if (this.isChatOpen) {
      const chatContainerEl = document.querySelector('.chat-container');
      const chatButtonEl = document.querySelector('.chat-button');
      
      if (chatContainerEl && chatButtonEl) {
        const isClickInside = chatContainerEl.contains(event.target as Node) || 
                             chatButtonEl.contains(event.target as Node);
        
        if (!isClickInside) {
          this.isChatOpen = false;
        }
      }
    }
  }
  
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    
    // Hide notification when chat is opened
    if (this.isChatOpen) {
      this.showInitialNotification = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }
  
  sendMessage(): void {
    if (!this.message.trim()) return;
    
    // Add user message to the chat
    this.addMessage('user', this.message);
    
    const userMessage = this.message;
    this.message = '';
    this.isLoading = true;
    
    // Send message to backend
    this.chatService.sendMessage(userMessage)
      .pipe(
        finalize(() => {
          // Don't hide loading indicator immediately - it will be hidden after typing delay
          this.scrollToBottom();
        })
      )
      .subscribe({
        next: (response) => {
          // Add bot response to chat with a short delay to simulate typing
          // Check if the response matches the expected format from the backend
          const responseMessage = response.message || response.answer || response.response || response.reply || 'I apologize, but I couldn\'t process your request.';
          
          // Simulate typing delay based on message length (more realistic)
          const typingDelay = Math.min(1500, responseMessage.length * 10);
          setTimeout(() => {
            this.isLoading = false; // Hide loading indicator after typing delay
            this.addMessage('bot', responseMessage);
          }, typingDelay);
        },
        error: (error) => {
          console.error('Error sending message', error);
          this.addMessage('bot', 'I apologize, but I encountered an error. Please try again later.');
        }
      });
  }
  
  addMessage(sender: string, message: string): void {
    const newMessage = { 
      sender, 
      message, 
      timestamp: new Date() 
    };
    
    this.messages.push(newMessage);
    this.chatService.saveChatMessage(newMessage);
    this.scrollToBottom();
  }
  
  clearChat(): void {
    this.messages = [];
    this.chatService.clearChatHistory();
    this.addMessage('bot', 'Welcome to TurathAI Assistant! How can I help you explore Tunisian heritage and culture today?');
  }
  
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
