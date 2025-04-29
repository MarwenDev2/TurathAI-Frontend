import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/Models/user';
import { UserPreferences } from '@core/Models/user-preferences';
import { UserPreferencesService } from '@core/services/user-preferences.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'profile-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styles: [`
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-radius: 16px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
    }
    .preference-badge {
      background-color: #f0f8ff;
      color: #1e88e5;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      margin-right: 8px;
      margin-bottom: 8px;
      display: inline-block;
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }
  `]
})
export class AboutComponent implements OnInit {
  @Input() userId!: number | undefined;
  user: User | null = null;
  userPreferences: UserPreferences | null = null;
  isLoading = false;
  isSaving = false;
  preferencesForm!: FormGroup;
  private editModal: Modal | undefined;

  constructor(
    private preferencesService: UserPreferencesService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.user = user;
          this.loadUserPreferences(); // Load preferences only after setting the user
        },
        error: (err) => {
          console.error('Failed to load user:', err);
          this.toastr.error('Could not load user data.');
        }
      });
    } else {
      console.warn('UserId is undefined in AboutComponent');
    }
  }
  

  initForm(): void {
    this.preferencesForm = this.fb.group({
      budgetRange: ['', Validators.required],
      preferenceCategories: ['', Validators.required],
      travelStyles: ['', Validators.required],
      languagePreferences: ['', Validators.required]
    });
  }

  loadUserPreferences(): void {
    this.isLoading = true;
    this.preferencesService.getUserPreferencesByUserId(this.user!.id)
      .subscribe({
        next: (preferences) => {
          this.userPreferences = preferences;
          this.updateFormWithPreferences();
          this.isLoading = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.userPreferences = null;
          } else {
            console.error('Error loading user preferences:', err);
            this.toastr.error('Failed to load user preferences');
          }
          this.isLoading = false;
        }
      });
  }

  updateFormWithPreferences(): void {
    if (this.userPreferences) {
      this.preferencesForm.patchValue({
        budgetRange: this.userPreferences.budgetRange || '',
        preferenceCategories: this.userPreferences.preferenceCategories || '',
        travelStyles: this.userPreferences.travelStyles || '',
        languagePreferences: this.userPreferences.languagePreferences || ''
      });
    } else {
      this.preferencesForm.reset();
    }
  }

  openEditModal(): void {
    if (!this.editModal) {
      const modalEl = document.getElementById('editPreferencesModal');
      if (modalEl) {
        this.editModal = new Modal(modalEl);
      }
    }
    this.editModal?.show();
  }
  splitCommaSeparated(value: string): string[] {
    return value
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);
  }
  
  savePreferences(): void {
    if (this.preferencesForm.invalid || !this.user) return;

    this.isSaving = true;

    const preferencesData = {
        budgetRange: this.preferencesForm.value.budgetRange,
        preferenceCategories: this.splitCommaSeparated(this.preferencesForm.value.preferenceCategories).join(','),
        travelStyles: this.splitCommaSeparated(this.preferencesForm.value.travelStyles).join(','),
        languagePreferences: this.splitCommaSeparated(this.preferencesForm.value.languagePreferences).join(','),
        userId: this.user.id // Make sure to include the user ID
    };

    const request$ = this.userPreferences && this.userPreferences.id
        ? this.preferencesService.updateUserPreferences(this.userPreferences.id, preferencesData)
        : this.preferencesService.createUserPreferences(preferencesData);

    request$.subscribe({
        next: (savedPrefs) => {
            this.userPreferences = savedPrefs;
            this.toastr.success(this.userPreferences ? 'Preferences updated' : 'Preferences created');
            this.editModal?.hide();
            this.isSaving = false;
        },
        error: (err) => {
            console.error('Error saving preferences:', err);
            this.toastr.error('Failed to save preferences');
            this.isSaving = false;
        }
    });
}
  

  private handleSaveSuccess(preferences: UserPreferences): void {
    this.userPreferences = preferences;
    this.isSaving = false;
    this.editModal?.hide();
    this.toastr.success('Preferences saved successfully');
  }

  private handleSaveError(err: any): void {
    console.error('Error saving preferences:', err);
    this.isSaving = false;
    this.toastr.error('Failed to save preferences');
  }

  getButtonText(): string {
    return this.userPreferences ? 'Edit' : 'Create Preferences';
  }

  getInterestsList(): string[] {
    return this.user?.interests?.split(',')?.map(i => i.trim()) || [];
  }

  getPreferenceList(field: string): string[] {
    if (!this.userPreferences || !(this.userPreferences as any)[field]) {
      return [];
    }
    return (this.userPreferences as any)[field].split(',').map((i: string) => i.trim());
  }

  getBudgetRangeClass(): string {
    if (!this.userPreferences?.budgetRange) return '';
    switch (this.userPreferences.budgetRange.toLowerCase()) {
      case 'low': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'high': return 'text-success';
      default: return '';
    }
  }
}
