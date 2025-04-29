import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/Models/user';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DetailsComponent } from '../details/details.component';

@Component({
  standalone: true,
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [CommonModule, NgbPaginationModule, NgbDropdownModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersListComponent implements OnInit {

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

  constructor(private userService: UserService,
              private toastr: ToastrService, 
              private modalService: NgbModal
              ) {}
  users: User[] = [];
  page: number = 1;
  pageSize: number = 10;
  selectedCountry: string | null = null;
  isLoading = false;

  get uniqueCountries(): string[] {
    return [...new Set(this.users.map(user => user.originCountry))].sort();
  }
  
  filteredUsers(): User[] {
    if (!this.selectedCountry) return this.users;
    return this.users.filter(user => user.originCountry === this.selectedCountry);
  }
  

  ngOnInit(): void {
    this.getAllUsers();
    console.log(this.users);
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.toastr.success('User deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete user:', err);
          this.toastr.error('Failed to delete user');
        }
      });
    }
  }

  viewUserDetails(user: User): void {
    const modalRef = this.modalService.open(DetailsComponent, { 
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.user = user;
  }
}
