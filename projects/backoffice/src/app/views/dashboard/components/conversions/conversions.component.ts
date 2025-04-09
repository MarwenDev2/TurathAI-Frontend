import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts'
import { ChartOptions } from 'projects/backoffice/src/app/common/apexchart.model';

@Component({
  selector: 'dashboard-conversions',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './conversions.component.html',
  styles: ``,
})
export class ConversionsComponent {
  conversionsChart: Partial<ChartOptions> = {
    chart: {
      height: 292,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '14px',
            color: 'undefined',
            offsetY: 100,
          },
          value: {
            offsetY: 55,
            fontSize: '20px',
            color: undefined,
            formatter: function (val) {
              return val + '%';
            },
          },
        },
        track: {
          background: 'rgba(170,184,197, 0.2)',
          margin: 0,
        },
      },
    },
    fill: {
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.2,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: ['#ff6c2f', '#22c55e'],
    series: [65.2],
    labels: ['Returning Customer'],
    responsive: [
      {
        breakpoint: 380,
        options: {
          chart: {
            height: 180,
          },
        },
      },
    ],
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  };
}
