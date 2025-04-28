import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '@core/Models/user';
import { UserPreferences } from '@core/Models/user-preferences';
import { UserPreferencesService } from '@core/services/user-preferences.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [CommonModule]
})
export class DetailsComponent {
  @Input() user!: User;
  userPreferences: UserPreferences | null = null;
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private preferencesService: UserPreferencesService
  ) {}

  ngOnInit(): void {
    this.loadUserPreferences();
  }

  loadUserPreferences(): void {
    if (!this.user.id) return;
    
    this.isLoading = true;
    this.preferencesService.getUserPreferencesByUserId(this.user.id)
      .subscribe({
        next: (preferences) => {
          this.userPreferences = preferences;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading user preferences:', err);
          this.isLoading = false;
        }
      });
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

  getProfileImage(): string {
    if (!this.user?.image) return 'assets/images/default-avatar.png';
    return `http://localhost:9090/assets/images/users/${this.user.image}`;
  }

  getCountryFlag(country: string | undefined): string {
    const flags: { [key: string]: string } = {
      Tunisia: 'https://flagcdn.com/24x18/tn.png',
      France: 'https://flagcdn.com/24x18/fr.png',
    Germany: 'https://flagcdn.com/24x18/de.png',
    Italy: 'https://flagcdn.com/24x18/it.png',
    Spain: 'https://flagcdn.com/24x18/es.png',
    Canada: 'https://flagcdn.com/24x18/ca.png',
    Australia: 'https://flagcdn.com/24x18/au.png',
    Japan: 'https://flagcdn.com/24x18/jp.png',
    China: 'https://flagcdn.com/24x18/cn.png',
    India: 'https://flagcdn.com/24x18/in.png',
    Brazil: 'https://flagcdn.com/24x18/br.png',
    Russia: 'https://flagcdn.com/24x18/ru.png',
    Mexico: 'https://flagcdn.com/24x18/mx.png',
    Argentina: 'https://flagcdn.com/24x18/ar.png',
    Egypt: 'https://flagcdn.com/24x18/eg.png',
    Morocco: 'https://flagcdn.com/24x18/ma.png',
    Switzerland: 'https://flagcdn.com/24x18/ch.png',
    Netherlands: 'https://flagcdn.com/24x18/nl.png',
    Belgium: 'https://flagcdn.com/24x18/be.png',
    Sweden: 'https://flagcdn.com/24x18/se.png',
    Denmark: 'https://flagcdn.com/24x18/dk.png',
    Norway: 'https://flagcdn.com/24x18/no.png',
    Finland: 'https://flagcdn.com/24x18/fi.png',
    Portugal: 'https://flagcdn.com/24x18/pt.png',
    Greece: 'https://flagcdn.com/24x18/gr.png',
    Poland: 'https://flagcdn.com/24x18/pl.png',
    Romania: 'https://flagcdn.com/24x18/ro.png',
    Hungary: 'https://flagcdn.com/24x18/hu.png',
    Palestine: 'https://flagcdn.com/24x18/ps.png',
    Qatar: 'https://flagcdn.com/24x18/qa.png',
    Kuwait: 'https://flagcdn.com/24x18/kw.png',
    Bahrain: 'https://flagcdn.com/24x18/bh.png',
    Lebanon: 'https://flagcdn.com/24x18/lb.png',
    Jordan: 'https://flagcdn.com/24x18/jo.png',
    Oman: 'https://flagcdn.com/24x18/om.png',
    Iraq: 'https://flagcdn.com/24x18/iq.png',
    Bangladesh: 'https://flagcdn.com/24x18/bd.png',
    Nepal: 'https://flagcdn.com/24x18/np.png',
    Pakistan: 'https://flagcdn.com/24x18/pk.png',
    Afghanistan: 'https://flagcdn.com/24x18/af.png',
    Myanmar: 'https://flagcdn.com/24x18/mm.png',
    Indonesia: 'https://flagcdn.com/24x18/id.png',
    Malaysia: 'https://flagcdn.com/24x18/my.png',
    Philippines: 'https://flagcdn.com/24x18/ph.png',
    Thailand: 'https://flagcdn.com/24x18/th.png',
    Vietnam: 'https://flagcdn.com/24x18/vn.png',
    Cambodia: 'https://flagcdn.com/24x18/kh.png',
    Laos: 'https://flagcdn.com/24x18/la.png',
    };
    return flags[country || ''] || '';
  }
}
