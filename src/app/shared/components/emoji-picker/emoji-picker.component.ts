import { Component, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss']
})
export class EmojiPickerComponent {
  @Input() showEmojiPicker = false;
  @Output() emojiSelected = new EventEmitter<string>();
  @Output() closeEmojiPicker = new EventEmitter<void>();
  @ViewChild('emojiContainer') emojiContainer!: ElementRef;

  // Catégories d'émojis
  categories = [
    { name: 'Smileys', icon: '😀' },
    { name: 'People', icon: '👋' },
    { name: 'Animals', icon: '🐶' },
    { name: 'Food', icon: '🍔' },
    { name: 'Activities', icon: '⚽' },
    { name: 'Travel', icon: '🚗' },
    { name: 'Objects', icon: '💡' },
    { name: 'Symbols', icon: '❤️' }
  ];
// Add this to your component class
trackById(index: number, item: any): number {
  return item.id || index; // Fall back to index if id is not available
}
  selectedCategory = 'Smileys';

  // Liste d'émojis par catégorie
  emojisByCategory: Record<string, string[]> = {
    'Smileys': ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘'],
    'People': ['👋', '🤚', '✋', '🖖', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇'],
    'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷'],
    'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑'],
    'Travel': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴'],
    'Objects': ['💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️'],
    'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '♥️', '💘', '💝', '💖', '💗', '💓', '💞']
  };

  constructor(private elementRef: ElementRef) {}

  stopEvent(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  get emojisInCategory(): string[] {
    return this.emojisByCategory[this.selectedCategory] || [];
  }

  selectCategory(category: string, event: Event): void {
    this.stopEvent(event);
    this.selectedCategory = category;
  }

  selectEmoji(emoji: string, event: Event): void {
    this.stopEvent(event);
    this.emojiSelected.emit(emoji);
  }

  close(event: Event): void {
    this.stopEvent(event);
    this.closeEmojiPicker.emit();
  }
}
