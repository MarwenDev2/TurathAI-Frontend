import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteService } from '@core/services/site.service';
import { CategoryService } from '@core/services/category.service';
import { Site } from '@core/Models/site';
import { Category } from '@core/Models/category';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-heritage-sites',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbRatingModule],
  templateUrl: './heritage-sites.component.html',
  styleUrls: ['heritage-sites.component.scss']
})
export class HeritageSitesComponent implements OnInit {
  sites: Site[] = [];
  filteredSites: Site[] = [];
  categories: Category[] = [];
  currentSlide = 0;
  featuredSites: Site[] = [];
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';
  wishlist: number[] = [];
  isGridView = true;

  constructor(
    private siteService: SiteService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadSites();
    this.loadCategories();
    this.loadWishlist();
  }

  loadSites() {
    this.siteService.getAllWithRatings().subscribe({
      next: (sites) => {
        console.log('Loaded sites:', sites);
        sites.forEach(site => {
          console.log(`Site ${site.name} has ID:`, site.id);
        });
        this.sites = sites;
        this.filteredSites = [...sites];
        this.featuredSites = sites
          .filter(site => site.imageIds && site.imageIds.length > 0)
          .slice(0, 3);
        this.sortSites();
      },
      error: (error) => {
        console.error('Error loading sites:', error);
      }
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadWishlist() {
    // Load wishlist from localStorage or service
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
    }
  }

  onSearchInput() {
    this.filterSites();
  }

  filterByCategory() {
    this.filterSites();
  }

  filterSites() {
    this.filteredSites = this.sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          site.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          site.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || site.categoryId === +this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    this.sortSites();
  }

  sortSites() {
    this.filteredSites.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return b.popularityScore - a.popularityScore;
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });
  }

  getSiteImage(imageIds: number[] | undefined): string {
    if (!imageIds || imageIds.length === 0) {
      return 'assets/images/default-site.jpg';
    }
    return `http://localhost:8080/images/${imageIds[0]}`;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.featuredSites.length) % this.featuredSites.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.featuredSites.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  toggleWishlist(siteId: number) {
    const index = this.wishlist.indexOf(siteId);
    if (index === -1) {
      this.wishlist.push(siteId);
    } else {
      this.wishlist.splice(index, 1);
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  isInWishlist(siteId: number): boolean {
    return this.wishlist.includes(siteId);
  }

  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bg-success';
      case 'Medium':
        return 'bg-warning';
      case 'Low':
        return 'bg-danger';
      default:
        return 'bg-info';
    }
  }

  getPopularityIcon(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bx bx-trending-up';
      case 'Medium':
        return 'bx bx-minus';
      case 'Low':
        return 'bx bx-trending-down';
      default:
        return 'bx bx-question-mark';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 8) return 'bg-success';
    if (score >= 5) return 'bg-warning';
    return 'bg-danger';
  }

  getScoreIcon(score: number): string {
    if (score >= 8) return 'bx bx-star';
    if (score >= 5) return 'bx bx-star-half';
    return 'bx bx-star';
  }

  toggleViewMode() {
    this.isGridView = !this.isGridView;
  }
} 