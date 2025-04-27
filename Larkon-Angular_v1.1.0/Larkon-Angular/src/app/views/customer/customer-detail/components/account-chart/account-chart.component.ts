import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { currency } from '@common/constants';
import { NgApexchartsModule } from 'ng-apexcharts'

@Component({
  selector: 'customer-account-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './account-chart.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountChartComponent {
  currency=currency
  chart2: Partial<ChartOptions> = {
    chart: {
      type: 'area',
      height: 208,
      sparkline: {
        enabled: true,
      },
    },
    series: [
      {
        data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
      },
    ],
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },

    markers: {
      size: 0,
    },
    colors: ['#FF6C2F'],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };
}
