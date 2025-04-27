import { Component, OnInit } from '@angular/core';
import { UserStatisticsService } from '@core/services/user-statistics';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'dashboard-user-distribution',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './user-distribution.component.html',
  styleUrls: ['./user-distribution.component.scss']
})
export class UserDistributionComponent implements OnInit {
  distributionChart: any = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    labels: [],
    colors: ['#3f51b5', '#ff9800', '#4caf50', '#f44336', '#9c27b0'],
    legend: { position: 'bottom' },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 } }
    }]
  };

  constructor(private statsService: UserStatisticsService) {}

  ngOnInit(): void {
    this.statsService.getUsersByCountry().subscribe(data => {
      this.distributionChart.series = data.map(item => item.count);
      this.distributionChart.labels = data.map(item => item.country);
    });
  }
}