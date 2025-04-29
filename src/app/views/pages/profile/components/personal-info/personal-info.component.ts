import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/Models/user';

@Component({
  selector: 'profile-personal-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-info.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PersonalInfoComponent {
  @Input() user: User | null = null;
  
  getMemberSince(): string {
    if (!this.user?.createdAt) return 'Not available';
    const date = new Date(this.user.createdAt);
    return date.toLocaleDateString();
  }
}