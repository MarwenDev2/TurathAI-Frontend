import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '@core/Models/user';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  imports: [CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './edit.component.html',
  styles: [`
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-radius: 16px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .form-label {
      font-weight: 500;
      color: #495057;
    }
    select option {
      padding: 8px;
    }
  `]
})
export class EditComponent {
  user: User | null = null;
  isLoading = false;
  isSaving = false;
  userForm!: FormGroup;
  
  // Country data
  countries: string[] = [
    'Tunisia', 'France', 'Germany', 'Italy', 'Spain', 'Canada', 'Australia', 
    'Japan', 'China', 'India', 'Brazil', 'Russia', 'Mexico', 'Argentina',
    'Egypt', 'Morocco', 'Switzerland', 'Netherlands', 'Belgium', 'Sweden',
    'Denmark', 'Norway', 'Finland', 'Portugal', 'Greece', 'Poland', 'Romania',
    'Hungary', 'Palestine', 'Qatar', 'Kuwait', 'Bahrain', 'Lebanon', 'Jordan',
    'Oman', 'Iraq', 'Bangladesh', 'Nepal', 'Pakistan', 'Afghanistan', 'Myanmar',
    'Indonesia', 'Malaysia', 'Philippines', 'Thailand', 'Vietnam', 'Cambodia', 'Laos'
  ];

  countryFlagMap: { [key: string]: string } = {
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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUser();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      role: ['USER'],
      originCountry: [''],
      status: ['ACTIVE']
    });
  }

  loadUser(): void {
    const userId = this.route.snapshot.params['id'];
    if (!userId) return;

    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue(user);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.isLoading = false;
        this.toastr.error('Failed to load user data');
        this.router.navigate(['/users/list']);
      }
    });
  }

  saveUser(): void {
    if (!this.user || !this.userForm.valid) return;

    this.isSaving = true;
    const updatedUser = { ...this.user, ...this.userForm.value };

    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('User updated successfully');
        this.router.navigate(['/users/list']);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.isSaving = false;
        this.toastr.error('Failed to update user');
      }
    });
  }
}
