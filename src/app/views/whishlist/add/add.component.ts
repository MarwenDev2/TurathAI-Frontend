import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDateStruct, NgbDatepickerModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap, map } from 'rxjs/operators';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexDataLabels, ApexStroke, ApexTitleSubtitle, ApexGrid, ApexXAxis, ApexYAxis, ApexResponsive, ApexLegend, ApexPlotOptions, ApexTooltip } from 'ng-apexcharts';

import { WishlistService } from '../../../core/services/wishlist.service';
import { ToastService } from '../../../core/services/toast-service';
import { ToastsContainer } from '../../../views/base-ui/toasts/toasts-container.component';
import { Wishlist } from '../../../core/Models/wishlist';
import { User } from '../../../core/Models/user';

export interface ChartOptions {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  colors: string[];
  stroke?: ApexStroke;
  series: any[];
  title: ApexTitleSubtitle;
  grid?: ApexGrid;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  labels?: string[];
  responsive: ApexResponsive[];
  tooltip?: ApexTooltip;
}

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

interface HeritageSiteCount {
  name: string;
  count: number;
}

interface UserActivity {
  user: User;
  wishlistCount: number;
}

interface LocationCount {
  location: string;
  count: number;
}

interface MonthlyTrend {
  month: string;
  count: number;
}

interface StatsWidget {
  title: string;
  value: number | string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbDatepickerModule,
    NgbToastModule,
    ToastsContainer,
    NgApexchartsModule
  ],
  providers: [DatePipe],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  wishlistGroups: WishlistGroup[] = [];
  totalItems = 0;
  uniqueUsers = 0;
  averageItemsPerUser = 0;
  now = new Date();

  totalStatsWidgets: StatsWidget[] = [];

  topHeritageSites: HeritageSiteCount[] = [];
  userActivity: UserActivity[] = [];
  locationCounts: LocationCount[] = [];
  monthlyTrends: MonthlyTrend[] = [];

  startDate: NgbDateStruct | null = null;
  endDate: NgbDateStruct | null = null;
  isLoading$ = new BehaviorSubject<boolean>(false);

  lineChart: Partial<ChartOptions> = {
    chart: {
      height: 380,
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    colors: ['#007bff'],
    stroke: { width: [4], curve: 'straight' },
    series: [{ name: 'Wishlists', data: [] }],
    title: { text: 'Wishlist Trends by Month', align: 'center' },
    grid: {
      row: { colors: ['transparent', 'transparent'], opacity: 0.2 },
      borderColor: '#f1f3fa'
    },
    xaxis: { categories: [] },
    responsive: [
      { breakpoint: 600, options: { chart: { height: 300 } } }
    ],
    tooltip: { enabled: true }
  };

  barChart: Partial<ChartOptions> = {
    chart: {
      height: 380,
      type: 'bar',
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    colors: ['#007bff'],
    series: [{ name: 'Wishlists', data: [] }],
    title: { text: 'Top Heritage Sites', align: 'center' },
    grid: { borderColor: '#f1f3fa' },
    xaxis: { categories: [] },
    yaxis: { title: { text: 'Wishlist Count' } },
    plotOptions: {
      bar: { horizontal: true }
    },
    responsive: [
      { breakpoint: 600, options: { chart: { height: 300 } } }
    ],
    tooltip: {
      enabled: true,
      y: { formatter: (val: number) => `${val} wishlists` },
      x: { formatter: (val: number, opts: any) => this.topHeritageSites[opts.dataPointIndex]?.name || '' }
    }
  };

  donutChart: Partial<ChartOptions> = {
    chart: {
      height: 380,
      type: 'donut',
      toolbar: { show: false }
    },
    dataLabels: { enabled: true },
    colors: ['#007bff', '#17a2b8', '#ffc107', '#dc3545', '#28a745'],
    series: [],
    labels: [],
    title: { text: 'User Activity', align: 'center' },
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '65%' } } },
    responsive: [
      { breakpoint: 600, options: { chart: { height: 300 } } }
    ],
    tooltip: {
      enabled: true,
      y: { formatter: (val: number) => `${val} wishlists` }
    }
  };

  pieChart: Partial<ChartOptions> = {
    chart: {
      height: 380,
      type: 'pie',
      toolbar: { show: false }
    },
    dataLabels: { enabled: true },
    colors: ['#007bff', '#17a2b8', '#ffc107', '#dc3545', '#28a745'],
    series: [],
    labels: [],
    title: { text: 'Location Distribution', align: 'center' },
    legend: { position: 'bottom' },
    responsive: [
      { breakpoint: 600, options: { chart: { height: 300 } } }
    ],
    tooltip: {
      enabled: true,
      y: { formatter: (val: number) => `${val} wishlists` }
    }
  };

  constructor(
    private wishlistService: WishlistService,
    public datePipe: DatePipe,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadWishlists();
  }

  loadWishlists(): void {
    this.isLoading$.next(true);
    this.toastService.show({
      content: 'Loading Analytics...',
      delay: 2500,
      classname: 'bg-info text-white'
    });

    this.wishlistService.getAllWishlists(
      null,
      this.startDate ? this.formatDate(this.startDate) : null,
      this.endDate ? this.formatDate(this.endDate) : null,
      0,
      1000
    ).pipe(
      map(page => ({
        ...page,
        content: this.groupWishlistsByUser(page.content)
      })),
      tap(page => {
        this.wishlistGroups = page.content;
        this.totalItems = page.totalElements;
        this.calculateInsights();
        this.toastService.show({
          content: 'Analytics loaded successfully',
          delay: 5000,
          classname: 'bg-success text-white'
        });
      }),
      catchError(err => {
        console.error('Error loading wishlists:', err);
        this.toastService.show({
          content: 'Failed to load Analytics',
          delay: 5000,
          classname: 'bg-danger text-white'
        });
        return of({ content: [], totalElements: 0, totalPages: 0, pageable: { pageNumber: 0, pageSize: 1000 } });
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

  onDateRangeChange(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
      const end = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
      if (start > end) {
        this.toastService.show({
          content: 'Start date must be before end date',
          delay: 5000,
          classname: 'bg-danger text-white'
        });
        this.startDate = null;
        this.endDate = null;
        return;
      }
    }
    this.loadWishlists();
  }

  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadWishlists();
  }

  private calculateInsights(): void {
    // Total Wishlist Statistics
    this.uniqueUsers = this.wishlistGroups.length;
    this.averageItemsPerUser = this.uniqueUsers > 0 ? this.totalItems / this.uniqueUsers : 0;

    this.totalStatsWidgets = [
      {
        title: 'Total Wishlist Items',
        value: this.totalItems,
        icon: 'bx-list-ul',
        iconColor: 'primary'
      },
      {
        title: 'Total Users',
        value: this.uniqueUsers,
        icon: 'bx-user',
        iconColor: 'info'
      },
      {
        title: 'Avg Items per User',
        value: this.averageItemsPerUser.toFixed(2),
        icon: 'bx-calculator',
        iconColor: 'warning'
      }
    ];

    // Most Popular Heritage Sites
    const siteCounts = new Map<string, number>();
    this.wishlistGroups.forEach(group => {
      group.sites.forEach(site => {
        const siteName = site.heritageSite.name;
        siteCounts.set(siteName, (siteCounts.get(siteName) || 0) + 1);
      });
    });
    this.topHeritageSites = Array.from(siteCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Update bar chart data
    this.barChart.series = [{
      name: 'Wishlists',
      data: this.topHeritageSites.map(site => site.count)
    }];
    this.barChart.xaxis = { categories: this.topHeritageSites.map(site => site.name) };

    // User Activity Insights
    this.userActivity = this.wishlistGroups
      .map(group => ({
        user: group.user,
        wishlistCount: group.sites.length
      }))
      .sort((a, b) => b.wishlistCount - a.wishlistCount)
      .slice(0, 5);

    // Update donut chart data
    this.donutChart.series = this.userActivity.map(user => user.wishlistCount);
    this.donutChart.labels = this.userActivity.map(user => `${user.user.firstName} ${user.user.lastName}`);

    // Location-Based Insights
    const locationCounts = new Map<string, number>();
    this.wishlistGroups.forEach(group => {
      group.sites.forEach(site => {
        const location = site.heritageSite.location;
        locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
      });
    });
    this.locationCounts = Array.from(locationCounts.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Update pie chart data
    this.pieChart.series = this.locationCounts.map(location => location.count);
    this.pieChart.labels = this.locationCounts.map(location => location.location);

    // Wishlist Trends Over Time (by month)
    const trends = new Map<string, number>();
    this.wishlistGroups.forEach(group => {
      group.sites.forEach(site => {
        const date = new Date(site.createdAt);
        const month = this.datePipe.transform(date, 'MMM yyyy') || 'Unknown';
        trends.set(month, (trends.get(month) || 0) + 1);
      });
    });
    this.monthlyTrends = Array.from(trends.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Update line chart data
    this.lineChart.series = [{ name: 'Wishlists', data: this.monthlyTrends.map(trend => trend.count) }];
    this.lineChart.xaxis = { categories: this.monthlyTrends.map(trend => trend.month) };
  }
}