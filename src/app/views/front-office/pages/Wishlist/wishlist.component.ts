import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@core/Models/user';
import { Wishlist } from '@core/Models/wishlist';
import { WishlistService } from '@core/services/wishlist.service';
import { AuthService } from '@core/services/auth.service';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbRatingModule, NgbTooltipModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class WishlistComponent implements OnInit {
  currentUser: User | null = null;
  wishlist: Wishlist[] = [];
  filteredWishlist: Wishlist[] = [];
  isLoading = false;
  errorMessage = '';

  sortBy: 'name' | 'date' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  sortOption: string = 'date-desc';

  selectedItems: Set<number> = new Set();
  selectAll: boolean = false;

  cities: string[] = [];
  selectedCity: string = 'All';

  totalSites: number = 0;
  mostPopularCity: string = '';
  mostPopularCityRating: number = 0;
  recentAdditions: Wishlist[] = [];

  // Confirmation Modal Properties
  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  confirmAction: 'single' | 'bulk' | null = null;
  wishlistIdToDelete: number | null = null;
  swiperThumbConfig: SwiperOptions = {
    modules: [Autoplay],
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 0,
  };
  constructor(private wishlistService: WishlistService,private authService: AuthService) {}

  ngOnInit(): void {
    register(); 
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.isLoading = false;
      }
    });
    this.loadWishlist();
  }
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-site.jpg';
    console.error('Failed to load image:', imgElement.src);
  }

  getImageUrls(imageIds: number[] | undefined): string[] {
    if (!imageIds || imageIds.length === 0) {
      return ['assets/images/qr-code.png'];
    }
    return imageIds.map(id => `http://localhost:8080/images/${id}`);
  }

  swiperConfig: SwiperOptions = {
    modules: [Autoplay],
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  }
  swiperNavigation: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      el: '.basic-pagination',
    },
    navigation: {
      nextEl: '.basic-next',
      prevEl: '.basic-prev',
    },
  }
  swiperPagination: SwiperOptions = {
    modules: [Autoplay, Pagination],
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      el: '.dynamic-pagination',
      dynamicBullets: true,
    },
  }
  loadWishlist(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.currentUser) {
      this.errorMessage = 'User not found.';
      this.isLoading = false;
      return;
    }
// Add this to your component to debug image loading
console.log('Wishlist items:', this.wishlist);
this.wishlist.forEach(item => {
  console.log('Heritage site:', item.heritageSite?.name);
  console.log('Image IDs:', item.heritageSite?.imageIds);
});
    this.wishlistService.getWishlist(this.currentUser.id).subscribe({
      next: (wishlist: Wishlist[]) => {
        this.wishlist = wishlist;
        this.filteredWishlist = [...this.wishlist];
        this.isLoading = false;
        this.calculateInsights();
        this.sortWishlist();
        this.updateCities();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load wishlist.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  updateCities(): void {
    const citySet = new Set<string>(
      this.wishlist.map(item => item.heritageSite?.location?.split(', ')[0] || 'Unknown')
    );
    this.cities = ['All', ...Array.from(citySet).sort()];
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    if (city === 'All') {
      this.filteredWishlist = [...this.wishlist];
    } else {
      this.filteredWishlist = this.wishlist.filter(
        item => (item.heritageSite?.location?.split(', ')[0] || 'Unknown') === city
      );
    }
    this.sortWishlist();
    this.selectedItems.clear();
    this.selectAll = false;
  }

  sortWishlist(): void {
    this.filteredWishlist.sort((a, b) => {
      if (this.sortBy === 'name') {
        const nameA = a.heritageSite?.name?.toLowerCase() || '';
        const nameB = b.heritageSite?.name?.toLowerCase() || '';
        return this.sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  }

  onSortChange(): void {
    const [by, order] = this.sortOption.split('-');
    this.sortBy = by as 'name' | 'date';
    this.sortOrder = order as 'asc' | 'desc';
    this.sortWishlist();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.selectedItems.clear();
    if (this.selectAll) {
      this.filteredWishlist.forEach(item => this.selectedItems.add(item.id));
    }
  }

  toggleItemSelection(itemId: number): void {
    if (this.selectedItems.has(itemId)) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.add(itemId);
    }
    this.selectAll = this.selectedItems.size === this.filteredWishlist.length;
  }

  bulkRemove(): void {
    if (this.selectedItems.size === 0) {
      this.errorMessage = 'Please select at least one item to remove.';
      return;
    }

    this.confirmMessage = `Are you sure you want to remove ${this.selectedItems.size} item(s) from your wishlist?`;
    this.confirmAction = 'bulk';
    this.showConfirmModal = true;
  }

  exportWishlist(): void {
    this.wishlistService.exportWishlists().subscribe({
      next: (wishlist: Wishlist[]) => {
        const csv = this.convertToCSV(wishlist);
        this.downloadCSV(csv, 'wishlist.csv');
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to export wishlist.';
        console.error(err);
      },
    });
  }

  convertToCSV(wishlist: Wishlist[]): string {
    const headers = ['ID', 'Heritage Site Name', 'Location', 'Added On'];
    const rows = wishlist.map(item => [
      item.id.toString(),
      item.heritageSite?.name || 'Unknown',
      item.heritageSite?.location || 'Unknown',
      new Date(item.createdAt).toLocaleDateString(),
    ]);
    return [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
  }

  downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  calculateInsights(): void {
    this.totalSites = this.wishlist.length;

    const cityCounts: { [key: string]: number } = {};
    this.wishlist.forEach(item => {
      const city = item.heritageSite?.location?.split(', ')[0] || 'Unknown';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    const mostPopular = Object.entries(cityCounts).reduce((a, b) => (b[1] > a[1] ? b : a), ['Unknown', 0]);
    this.mostPopularCity = mostPopular[0] === 'Unknown' ? '' : `${mostPopular[0]} (${mostPopular[1]} sites)`;
    this.mostPopularCityRating = mostPopular[1] > 0 ? Math.min(5, Math.ceil(mostPopular[1] / 2)) : 0;

    if (this.wishlist.length > 0) {
      const sortedByDate = [...this.wishlist].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Sort descending (newest first)
      );
      this.recentAdditions = sortedByDate.slice(0, 2); // Take the top 2 newest items
    } else {
      this.recentAdditions = [];
    }
  }

  removeFromWishlist(wishlistId: number): void {
    this.wishlistIdToDelete = wishlistId;
    this.confirmMessage = 'Are you sure you want to remove this site from your wishlist?';
    this.confirmAction = 'single';
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmMessage = '';
    this.confirmAction = null;
    this.wishlistIdToDelete = null;
  }

  confirmModalAction(): void {
    if (this.confirmAction === 'single' && this.wishlistIdToDelete !== null) {
      this.wishlistService.removeWishlist(this.wishlistIdToDelete).subscribe({
        next: () => {
          this.loadWishlist(); // Refresh the data
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to remove site from wishlist.';
          console.error(err);
        },
      });
    } else if (this.confirmAction === 'bulk') {
      const wishlistIds = Array.from(this.selectedItems);
      this.wishlistService.bulkRemoveWishlists(wishlistIds).subscribe({
        next: () => {
          this.loadWishlist(); // Refresh the data
          this.selectedItems.clear();
          this.selectAll = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to remove selected items.';
          console.error(err);
        },
      });
    }
    this.closeConfirmModal();
  }
}