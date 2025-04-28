import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '@core/services/StatisticsService';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'dashboard-insight-distribution',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './local-insight-distribution.component.html',
  styleUrls: ['./local-insight-distribution.component.scss']
})
export class LocalInsightDistributionComponent implements OnInit {
  insightChart: any = {
    series: [],
    chart: {
      type: 'donut',
      height: 350
    },
    labels: [],
    colors: ['#ff5722', '#009688', '#3f51b5', '#ffc107', '#9c27b0'],
    legend: { position: 'bottom' },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 } }
    }]
  };

  constructor(private statsService: StatisticsService) {}

  ngOnInit(): void {
    this.statsService.getInsightsByType().subscribe(data => {
      this.insightChart.series = data.map((item: any) => item.count);
      this.insightChart.labels = data.map((item: any) => item.type);
    });
  }
}
