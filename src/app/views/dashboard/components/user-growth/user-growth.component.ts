import { Component, OnInit } from '@angular/core';
import { UserStatisticsService } from '@core/services/user-statistics';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'dashboard-user-growth',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './user-growth.component.html',
  styleUrls: ['./user-growth.component.scss']
})
export class UserGrowthComponent implements OnInit {
  growthChart: any = {
    series: [{
      name: 'Users',
      data: []
    }],
    chart: {
      height: 350,
      type: 'line',
      toolbar: { show: false }
    },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: [] },
    colors: ['#3f51b5'],
    markers: { size: 5 },
    tooltip: {
      y: { formatter: (val: number) => `${val} users` }
    }
  };

  constructor(private statsService: UserStatisticsService) {}

  ngOnInit(): void {
    this.statsService.getUserGrowth().subscribe(data => {
      this.growthChart.series[0].data = data.counts;
      this.growthChart.xaxis.categories = data.months;
    });
  }
}