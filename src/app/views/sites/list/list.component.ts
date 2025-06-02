import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DecimalPipe } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink , Router } from '@angular/router';
import { state2Data } from '../../apps/widgets/data';
import { CommonModule } from '@angular/common';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/Models/category';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    DecimalPipe,
    NgbPaginationModule,
    NgbDropdownModule,
    RouterLink,
    BaseChartDirective,
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
  sitesNeedingMaintenance: Site[] = [];
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

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        display: true,
        title: {
          display: true,
          text: 'Heritage Sites'
        },
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: 'Average Rating'
        },
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
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
        hoverBackgroundColor: '#2f6ecb',
        barThickness: 20
      }
    ]
  };

  // Donut Chart Configuration
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#3b7ddd',
        '#1cbb8c',
        '#f7b84b',
        '#f06548',
        '#74788d',
        '#34c38f',
        '#50a5f1',
        '#f1b44c',
        '#556ee6',
        '#f46a6a'
      ],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = typeof context.raw === 'number' ? context.raw : 0;
            const dataset = context.dataset;
            
            // Calculate total with proper type handling
            let total = 0;
            if (dataset.data && Array.isArray(dataset.data)) {
              total = dataset.data.reduce((acc: number, curr: unknown) => {
                const num = typeof curr === 'number' ? curr : 0;
                return acc + num;
              }, 0);
            }

            // Calculate percentage with null check
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  constructor(
    private siteService: SiteService,
    private categoryService: CategoryService ,
    private router: Router
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
        
        // Identify sites that need maintenance
        this.sitesNeedingMaintenance = this.siteService.getSitesNeedingMaintenance(this.sites);
        
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

// Already present in your component — just ensure they're linked
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

getSiteImage(imageIds: number[] | undefined): string {
  if (!imageIds || imageIds.length === 0) {
    return 'assets/images/default-site.jpg';
  }
  return `${environment.apiUrl}/images/${imageIds[0]}`;
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
        this.filteredSites.sort((a, b) => {
          const popularityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return popularityOrder[b.expectedPopularity] - popularityOrder[a.expectedPopularity];
        });
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
    return imageIds.map(id => `${environment.apiUrl}/images/${id}`);
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

  prepareChartData(): void {
    // Prepare bar chart data
    const topSites = [...this.sites]
      .filter(site => site.averageRating && site.averageRating > 0)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5);

    this.barChartData = {
      ...this.barChartData,
      labels: topSites.map(site => site.name),
      datasets: [{
        ...this.barChartData.datasets[0],
        data: topSites.map(site => site.averageRating || 0)
      }]
    };

    // Prepare donut chart data
    const categoryCounts = new Map<string, number>();
    this.sites.forEach(site => {
      const categoryName = this.getCategoryName(site.categoryId);
      categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1);
    });

    this.doughnutChartData = {
      ...this.doughnutChartData,
      labels: Array.from(categoryCounts.keys()),
      datasets: [{
        ...this.doughnutChartData.datasets[0],
        data: Array.from(categoryCounts.values())
      }]
    };
  }

  viewSite(id: number): void {
    this.router.navigate(['/sites/details', id]);
  }
  
  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'badge-soft-success';
      case 'Medium':
        return 'badge-soft-warning';
      case 'Low':
        return 'badge-soft-danger';
      default:
        return 'badge-soft-secondary';
    }
  }
  
  getExpectedPopularityFromScore(score: number): string {
    if (score >= 8) {
      return 'High';
    } else if (score >= 5) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  getPopularityIcon(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bx bx-trending-up';
      case 'Medium':
        return 'bx bx-trending-flat';
      case 'Low':
        return 'bx bx-trending-down';
      default:
        return 'bx bx-question-mark';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 8) {
      return 'badge-soft-success';
    } else if (score >= 5) {
      return 'badge-soft-warning';
    } else {
      return 'badge-soft-danger';
    }
  }

  getScoreIcon(score: number): string {
    if (score >= 8) {
      return 'bx bx-trending-up';
    } else if (score >= 5) {
      return 'bx bx-trending-flat';
    } else {
      return 'bx bx-trending-down';
    }
  }
}