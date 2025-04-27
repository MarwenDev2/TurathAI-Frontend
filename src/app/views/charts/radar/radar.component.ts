import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-radar',
  standalone: true,
  imports: [UIExamplesListComponent,NgApexchartsModule],
  templateUrl: './radar.component.html',
  styles: ``
})
export class RadarComponent {
  title="radar charts"
  radarChart: Partial<ChartOptions> = {
    chart: {
      height: 350,
      type: 'radar',
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      },
    ],
    colors: ['#7f56da'],
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  }

  polygonradarChart: Partial<ChartOptions> = {
    chart: {
      height: 350,
      type: 'radar',
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'Series 1',
        data: [20, 100, 40, 30, 50, 80, 33],
      },
    ],
    labels: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    plotOptions: {
      radar: {
        size: 140,
      },
    },
    colors: ['#ff6c2f'],
    markers: {
      size: 4,
      colors: ['#fff'],
      strokeWidth: 2,
    },
    yaxis: {
      tickAmount: 7,
    },
  }

  multipleradarChart: Partial<ChartOptions> = {
    chart: {
      height: 350,
      type: 'radar',
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: 'Series 2',
        data: [20, 30, 40, 80, 20, 80],
      },
      {
        name: 'Series 3',
        data: [44, 76, 78, 13, 43, 10],
      },
    ],
    stroke: {
      width: 0,
    },
    fill: {
      opacity: 0.4,
    },
    markers: {
      size: 0,
    },
    legend: {
      offsetY: -10,
    },
    colors: ['#1c84ee', '#ef5f5f', '#4ecac2'],
    labels: ['2011', '2012', '2013', '2014', '2015', '2016'],
  }

  changeTraffic() {
    setTimeout(() => {
      this.multipleradarChart.series = [
        {
          name: 'Series 1',
          data: randomSeries(),
        },
        {
          name: 'Series 2',
          data: randomSeries(),
        },
        {
          name: 'Series 3',
          data: randomSeries(),
        },
      ]
    }, 500)
  }
}

function randomSeries() {
  var arr = []
  for (var i = 0; i < 6; i++) {
    arr.push(Math.floor(Math.random() * 100))
  }

  return arr
}
