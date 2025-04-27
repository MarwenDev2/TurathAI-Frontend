import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { state2Data } from '../../apps/widgets/data';
import { WidgetState3Component } from '../../apps/widgets/components/widget-state3/widget-state3.component';
import { CommonModule } from '@angular/common';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/Models/category';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    DecimalPipe,
    NgbPaginationModule,
    NgbDropdownModule,
    RouterLink,
    NgbRatingModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  title = 'SITE LIST';
  sites: Site[] = [];
  filteredSites: Site[] = [];
  categoriesMap = new Map<number, string>();
  selectedSites: number[] = [];
  allSelected: boolean = false;
  page = 1;
  pageSize = 5;
  searchTerm = '';
  currentSort = 'name'; // default sort
  searchSubject = new Subject<string>();
  basicRating = 5

  stateData = [
    {
      icon: 'iconamoon:3d-duotone',
      iconColor: 'info',
      amount: '0',
      title: 'Total Sites',
      badge: '0',
      badgeColor: 'success',
      badgeIcon: 'bx bx-doughnut-chart',
    },
    {
      icon: 'iconamoon:category-duotone',
      iconColor: 'success',
      amount: '0',
      title: 'Categories',
      badge: '0',
      badgeColor: 'success',
      badgeIcon: 'bx bx-bar-chart-alt-2',
    },
  ];

  constructor(
    private siteService: SiteService,
    private categoryService: CategoryService
  ) {
    // Setup debounce for search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.searchSites();
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadStatistics();
  }

  
  loadData(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      categories.forEach((cat) => this.categoriesMap.set(cat.id, cat.name));
      
      this.siteService.getAllWithRatings().subscribe((data) => {
        this.sites = data;
        this.filteredSites = [...this.sites];
        this.sortSites();
        
        // Prepare chart data after sites are loaded
        this.prepareChartData();
      });
    });
  }


  loadStatistics(): void {
    this.siteService.getSiteCount().subscribe({
      next: (count) => {
        this.stateData[0].amount = count.toString();
        this.stateData[0].badge = '↑5%';
      },
      error: (err) => {
        console.error('Error fetching site count:', err);
      }
    });
  
    this.categoryService.getCategoryCount().subscribe({
      next: (count) => {
        this.stateData[1].amount = count.toString();
        this.stateData[1].badge = '↑3%';
      },
      error: (err) => {
        console.error('Error fetching category count:', err);
      }
    });
  }

// Already present in your component — just ensure they’re linked
onSearchInput(): void {
  this.searchSubject.next(this.searchTerm);
}

getFirstImageUrl(imageIds: number[]): string {
  const urls = this.getImageUrls(imageIds);
  return urls[0];
}

getCategoryName(categoryId: number): string {
  return this.categoriesMap.get(categoryId) || 'Unknown';
}


  searchSites(): void {
    if (!this.searchTerm) {
      this.filteredSites = [...this.sites];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSites = this.sites.filter(site => 
        site.location.toLowerCase().includes(term) ||
        site.name.toLowerCase().includes(term) ||
        site.description.toLowerCase().includes(term)
    );}
    this.page = 1; // Reset to first page
    this.sortSites();
  }

  sortBy(field: string): void {
    this.currentSort = field;
    this.sortSites();
  }

  sortSites(): void {
    switch (this.currentSort) {
      case 'name':
        this.filteredSites.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
        this.filteredSites.sort((a, b) => b.popularityScore - a.popularityScore);
        break;
      case 'location':
        this.filteredSites.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default:
        this.filteredSites.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  getSortLabel(): string {
    switch (this.currentSort) {
      case 'name': return 'Name (A-Z)';
      case 'popularity': return 'Popularity (High-Low)';
      case 'location': return 'Location (A-Z)';
      default: return 'Name (A-Z)';
    }
  }

  get paginatedSite(): Site[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize; 
    return this.filteredSites.slice(start, end); 
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredSites.length / this.pageSize);
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }


  getImageUrls(imageIds: number[]): string[] {
    if (!imageIds || imageIds.length === 0) {
      return ['assets/images/qr-code.png'];
    }
    return imageIds.map(id => `http://localhost:8080/images/${id}`);
  }


  deleteSite(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2',
        cancelButton: 'btn btn-danger w-xs mt-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.siteService.delete(id).subscribe({
          next: () => {
            this.sites = this.sites.filter((s) => s.id !== id);
            this.filteredSites = this.filteredSites.filter((s) => s.id !== id);
            Swal.fire({
              title: 'Deleted!',
              text: 'The site has been deleted.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary w-xs mt-2',
              },
              buttonsStyling: false,
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the site.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary w-xs mt-2',
              },
              buttonsStyling: false,
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'The site is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary w-xs mt-2',
          },
          buttonsStyling: false,
        });
      }
    });
  }

  toggleSelection(siteId: number) {
    const index = this.selectedSites.indexOf(siteId);
    if (index === -1) {
      this.selectedSites.push(siteId);
    } else {
      this.selectedSites.splice(index, 1);
    }
    this.checkIfAllSelected();
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.selectedSites = this.paginatedSite.map(site => site.id);
    } else {
      this.selectedSites = [];
    }
  }
  
  checkIfAllSelected() {
    this.allSelected = this.paginatedSite.every(site => this.selectedSites.includes(site.id));
  }
  

  deleteSelectedSites() {
    if (confirm('Are you sure you want to delete the selected sites?')) {
      this.selectedSites.forEach(id => this.deleteSite(id));
      this.selectedSites = [];
      this.allSelected = false;
    }
  }

  downloadExcel() {
    this.siteService.downloadExcel().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'sites.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Heritage Sites'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Average Rating'
        },
        min: 0,
        max: 5,
        ticks: {
          stepSize: 0.5
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Rating: ${context.raw}`
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        backgroundColor: '#3b7ddd',
        borderColor: '#3b7ddd',
        hoverBackgroundColor: '#2f6ecb'
      }
    ]
  };

  prepareChartData(): void {
    // Sort sites by average rating (highest first)
    const topSites = [...this.sites]
      .filter(site => site.averageRating && site.averageRating > 0)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5); // Get top 5 sites

    // Update chart data
    this.barChartData.labels = topSites.map(site => site.name);
    this.barChartData.datasets[0].data = topSites.map(site => site.averageRating || 0);
  }
}