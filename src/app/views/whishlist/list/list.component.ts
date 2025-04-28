import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap, map } from 'rxjs/operators';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ToastService } from '../../../core/services/toast-service';
import { ToastsContainer } from "../../../views/base-ui/toasts/toasts-container.component";
import { Wishlist } from '../../../core/Models/wishlist';
import { User } from '../../../core/Models/user';

interface WishlistGroup {
  user: User;
  sites: Wishlist[];
}

interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

type ExportFieldKey = 'userName' | 'heritageSite' | 'location' | 'createdAt';

interface ExportFields extends Record<ExportFieldKey, boolean> {}
interface ExportHeaders extends Record<ExportFieldKey, string> {}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgbToastModule,
    ToastsContainer
  ],
  providers: [DatePipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  wishlistGroups: WishlistGroup[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 10;

  searchTerm = '';
  startDate: NgbDateStruct | null = null;
  endDate: NgbDateStruct | null = null;

  isLoading$ = new BehaviorSubject<boolean>(false);
  selectedWishlistIds: Set<number> = new Set();

  showExportModal: boolean = false;
  exportFields: ExportFields = {
    userName: true,
    heritageSite: true,
    location: true,
    createdAt: true
  };

  private toastService = inject(ToastService);

  constructor(
    private wishlistService: WishlistService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadWishlists();
  }

  loadWishlists(): void {
    this.isLoading$.next(true);

    this.wishlistService.getAllWishlists(
      this.searchTerm || null,
      this.startDate ? this.formatDate(this.startDate) : null,
      this.endDate ? this.formatDate(this.endDate) : null,
      this.page - 1,
      this.pageSize
    ).pipe(
      map(page => ({
        ...page,
        content: this.groupWishlistsByUser(page.content)
      })),
      tap(page => {
        this.wishlistGroups = page.content;
        this.totalItems = page.totalElements;
      }),
      catchError(err => {
        this.toastService.show({
          content: 'Failed to load wishlists',
          delay: 4000,
          classname: 'bg-danger text-white'
        });
        console.error(err);
        return of({ content: [], totalElements: 0, totalPages: 0, pageable: { pageNumber: 0, pageSize: this.pageSize } });
      }),
      finalize(() => this.isLoading$.next(false))
    ).subscribe();
  }

  private groupWishlistsByUser(wishlists: Wishlist[]): WishlistGroup[] {
    const grouped = new Map<number, WishlistGroup>();
    wishlists.forEach(wishlist => {
      const userId = wishlist.user.id;
      if (!grouped.has(userId)) {
        grouped.set(userId, {
          user: wishlist.user,
          sites: []
        });
      }
      grouped.get(userId)!.sites.push(wishlist);
    });
    return Array.from(grouped.values());
  }

  private formatDate(date: NgbDateStruct): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  onSearch(): void {
    this.page = 1;
    this.loadWishlists();
  }

  onDateRangeChange(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
      const end = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
      if (start > end) {
        this.toastService.show({
          content: 'Start date must be before end date',
          delay: 4000,
          classname: 'bg-danger text-white'
        });
        this.startDate = null;
        this.endDate = null;
        return;
      }
    }
    this.page = 1;
    this.loadWishlists();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.startDate = null;
    this.endDate = null;
    this.page = 1;
    this.loadWishlists();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadWishlists();
  }

  removeWishlist(wishlistId: number): void {
    if (!confirm('Are you sure you want to remove this site from the wishlist?')) return;

    this.isLoading$.next(true);

    this.wishlistService.removeWishlist(wishlistId)
      .pipe(
        tap(response => {
          this.toastService.show({
            content: response.message || 'Site removed from wishlist',
            delay: 4000,
            classname: 'bg-success text-white'
          });
          this.selectedWishlistIds.delete(wishlistId);
          this.loadWishlists();
        }),
        catchError(err => {
          this.toastService.show({
            content: 'Failed to remove site',
            delay: 4000,
            classname: 'bg-danger text-white'
          });
          console.error('Error removing wishlist:', err);
          return of(null);
        }),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe();
  }

  toggleSelection(wishlistId: number): void {
    if (this.selectedWishlistIds.has(wishlistId)) {
      this.selectedWishlistIds.delete(wishlistId);
    } else {
      this.selectedWishlistIds.add(wishlistId);
    }
  }

  bulkRemove(): void {
    if (this.selectedWishlistIds.size === 0) {
      this.toastService.show({
        content: 'No items selected for removal',
        delay: 4000,
        classname: 'bg-danger text-white'
      });
      return;
    }

    if (!confirm(`Are you sure you want to remove ${this.selectedWishlistIds.size} wishlist items?`)) return;

    this.isLoading$.next(true);

    const wishlistIds = Array.from(this.selectedWishlistIds);
    this.wishlistService.bulkRemoveWishlists(wishlistIds)
      .pipe(
        tap(response => {
          this.toastService.show({
            content: response.message || `Removed ${wishlistIds.length} wishlist items`,
            delay: 4000,
            classname: 'bg-success text-white'
          });
          this.selectedWishlistIds.clear();
          this.loadWishlists();
        }),
        catchError(err => {
          this.toastService.show({
            content: 'Failed to remove selected items',
            delay: 4000,
            classname: 'bg-danger text-white'
          });
          console.error('Error bulk removing wishlists:', err);
          return of(null);
        }),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe();
  }

  openExportModal(): void {
    this.showExportModal = true;
    Object.keys(this.exportFields).forEach(key => {
      this.exportFields[key as ExportFieldKey] = true;
    });
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  selectAllFields(): void {
    Object.keys(this.exportFields).forEach(key => {
      this.exportFields[key as ExportFieldKey] = true;
    });
  }

  deselectAllFields(): void {
    Object.keys(this.exportFields).forEach(key => {
      this.exportFields[key as ExportFieldKey] = false;
    });
  }

  exportWishlists(): void {
    const selectedFields = Object.values(this.exportFields).filter(Boolean);
    if (selectedFields.length === 0) {
      this.toastService.show({
        content: 'Please select at least one field to export.',
        delay: 4000,
        classname: 'bg-danger text-white'
      });
      return;
    }

    this.isLoading$.next(true);

    this.wishlistService.exportWishlists()
      .pipe(
        tap(wishlists => {
          this.processExport(wishlists);
          this.toastService.show({
            content: 'Wishlists exported successfully',
            delay: 4000,
            classname: 'bg-success text-white'
          });
        }),
        catchError(err => {
          this.toastService.show({
            content: 'Failed to export wishlists',
            delay: 4000,
            classname: 'bg-danger text-white'
          });
          console.error(err);
          return of(null);
        }),
        finalize(() => {
          this.isLoading$.next(false);
          this.closeExportModal();
        })
      )
      .subscribe();
  }

  private processExport(wishlists: Wishlist[]): void {
    if (wishlists.length === 0) {
      this.toastService.show({
        content: 'No wishlists to export.',
        delay: 4000,
        classname: 'bg-danger text-white'
      });
      return;
    }

    const allHeaders: ExportHeaders = {
      userName: 'User Full Name',
      heritageSite: 'Heritage Site',
      location: 'Location',
      createdAt: 'Added Date'
    };

    const headers = Object.keys(this.exportFields)
      .filter(key => this.exportFields[key as ExportFieldKey])
      .map(key => allHeaders[key as ExportFieldKey]);

    const rows = wishlists.map(wishlist => {
      const row: string[] = [];
      if (this.exportFields.userName) row.push(`${wishlist.user.firstName} ${wishlist.user.lastName}`);
      if (this.exportFields.heritageSite) row.push(wishlist.heritageSite.name);
      if (this.exportFields.location) row.push(wishlist.heritageSite.location);
      if (this.exportFields.createdAt) row.push(this.datePipe.transform(wishlist.createdAt, 'MMM d, yyyy') || 'Unknown Date');
      return row;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wishlists_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}