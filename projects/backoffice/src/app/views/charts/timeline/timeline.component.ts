import { Component } from '@angular/core';
import type { ChartOptions } from '@common/apexchart.model';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import moment from 'moment';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [NgApexchartsModule,UIExamplesListComponent],
  templateUrl: './timeline.component.html',
  styles: ``
})
export class TimelineComponent {
  title="timeline charts"
  timelineChart: Partial<ChartOptions> = {
    series: [
      {
        data: [
          {
            x: 'Code',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-04').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-04').getTime(),
              new Date('2019-03-08').getTime(),
            ],
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-12').getTime(),
            ],
          },
          {
            x: 'Deployment',
            y: [
              new Date('2019-03-12').getTime(),
              new Date('2019-03-18').getTime(),
            ],
          },
        ],
      },
    ],
    chart: {
      height: 350,
      type: 'rangeBar',
      toolbar: {
        show: false,
      },
    },
    colors: ['#4ecac2'],
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: false,
      },
    },
  }

  distributedChart: Partial<ChartOptions> = {
    series: [
      {
        data: [
          {
            x: 'Analysis',
            y: [
              new Date('2019-02-27').getTime(),
              new Date('2019-03-04').getTime(),
            ],
            fillColor: '#1c84ee',
          },
          {
            x: 'Design',
            y: [
              new Date('2019-03-04').getTime(),
              new Date('2019-03-08').getTime(),
            ],
            fillColor: '#7f56da',
          },
          {
            x: 'Coding',
            y: [
              new Date('2019-03-07').getTime(),
              new Date('2019-03-10').getTime(),
            ],
            fillColor: '#ff86c8',
          },
          {
            x: 'Testing',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-12').getTime(),
            ],
            fillColor: '#f9b931',
          },
          {
            x: 'Deployment',
            y: [
              new Date('2019-03-12').getTime(),
              new Date('2019-03-17').getTime(),
            ],
            fillColor: '#4ecac2',
          },
        ],
      },
    ],
    chart: {
      height: 350,
      type: 'rangeBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        var label = opts.w.globals.labels[opts.dataPointIndex]
        var a = moment(val[0])
        var b = moment(val[1])
        var diff = b.diff(a, 'days')
        return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
      },

      style: {
        colors: ['#f3f4f5', '#fff'],
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      show: false,
    },
    grid: {
      row: {
        colors: ['#f3f4f5', '#fff'],
        opacity: 1,
      },
      padding: {
        top: -15,
        right: 10,
        bottom: -15,
        left: -10,
      },
    },
  }

  multitimelineChart: Partial<ChartOptions> = {
    series: [
      {
        name: 'Bob',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-08').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-11').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-11').getTime(),
              new Date('2019-03-16').getTime(),
            ],
          },
        ],
      },
      {
        name: 'Joe',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-05').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-06').getTime(),
              new Date('2019-03-09').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-10').getTime(),
              new Date('2019-03-19').getTime(),
            ],
          },
        ],
      },
    ],
    chart: {
      height: 350,
      type: 'rangeBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        var label = opts.w.globals.labels[opts.dataPointIndex]
        var a = moment(val[0])
        var b = moment(val[1])
        var diff = b.diff(a, 'days')
        return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
      },
    },

    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100],
      },
    },
    colors: ['#ff6c2f', '#f9b931'],
    xaxis: {
      type: 'datetime',
    },
    legend: {
      position: 'top',
    },
  }

  advancedtimelineChart: Partial<ChartOptions> = {
    series: [
      {
        name: 'Bob',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-08').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-05').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-07').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-03').getTime(),
              new Date('2019-03-09').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-11').getTime(),
            ],
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-11').getTime(),
              new Date('2019-03-16').getTime(),
            ],
          },
          {
            x: 'Design',
            y: [
              new Date('2019-03-01').getTime(),
              new Date('2019-03-03').getTime(),
            ],
          },
        ],
      },
      {
        name: 'Joe',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-05').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-06').getTime(),
              new Date('2019-03-16').getTime(),
            ],
            goals: [
              {
                name: 'Break',
                value: new Date('2019-03-10').getTime(),
                strokeColor: '#CD2F2A',
              },
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-03').getTime(),
              new Date('2019-03-07').getTime(),
            ],
          },
          {
            x: 'Deployment',
            y: [
              new Date('2019-03-20').getTime(),
              new Date('2019-03-22').getTime(),
            ],
          },
          {
            x: 'Design',
            y: [
              new Date('2019-03-10').getTime(),
              new Date('2019-03-16').getTime(),
            ],
          },
        ],
      },
      {
        name: 'Dan',
        data: [
          {
            x: 'Code',
            y: [
              new Date('2019-03-10').getTime(),
              new Date('2019-03-17').getTime(),
            ],
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-09').getTime(),
            ],
            goals: [
              {
                name: 'Break',
                value: new Date('2019-03-07').getTime(),
                strokeColor: '#CD2F2A',
              },
            ],
          },
        ],
      },
    ],
    chart: {
      height: 350,
      type: 'rangeBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
      },
    },
    xaxis: {
      type: 'datetime',
    },
    stroke: {
      width: 1,
    },
    colors: ['#ef5f5f', '#f9b931', '#4ecac2'],
    fill: {
      type: 'solid',
      opacity: 0.6,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
  }

  grouptimelineChart: Partial<ChartOptions> = {
    series: [
      // George Washington
      {
        name: 'George Washington',
        data: [
          {
            x: 'President',
            y: [
              new Date(1789, 3, 30).getTime(),
              new Date(1797, 2, 4).getTime(),
            ],
          },
        ],
      },
      // John Adams
      {
        name: 'John Adams',
        data: [
          {
            x: 'President',
            y: [new Date(1797, 2, 4).getTime(), new Date(1801, 2, 4).getTime()],
          },
          {
            x: 'Vice President',
            y: [
              new Date(1789, 3, 21).getTime(),
              new Date(1797, 2, 4).getTime(),
            ],
          },
        ],
      },
      // Thomas Jefferson
      {
        name: 'Thomas Jefferson',
        data: [
          {
            x: 'President',
            y: [new Date(1801, 2, 4).getTime(), new Date(1809, 2, 4).getTime()],
          },
          {
            x: 'Vice President',
            y: [new Date(1797, 2, 4).getTime(), new Date(1801, 2, 4).getTime()],
          },
          {
            x: 'Secretary of State',
            y: [
              new Date(1790, 2, 22).getTime(),
              new Date(1793, 11, 31).getTime(),
            ],
          },
        ],
      },
      // Aaron Burr
      {
        name: 'Aaron Burr',
        data: [
          {
            x: 'Vice President',
            y: [new Date(1801, 2, 4).getTime(), new Date(1805, 2, 4).getTime()],
          },
        ],
      },
      // George Clinton
      {
        name: 'George Clinton',
        data: [
          {
            x: 'Vice President',
            y: [
              new Date(1805, 2, 4).getTime(),
              new Date(1812, 3, 20).getTime(),
            ],
          },
        ],
      },
      // John Jay
      {
        name: 'John Jay',
        data: [
          {
            x: 'Secretary of State',
            y: [
              new Date(1789, 8, 25).getTime(),
              new Date(1790, 2, 22).getTime(),
            ],
          },
        ],
      },
      // Edmund Randolph
      {
        name: 'Edmund Randolph',
        data: [
          {
            x: 'Secretary of State',
            y: [
              new Date(1794, 0, 2).getTime(),
              new Date(1795, 7, 20).getTime(),
            ],
          },
        ],
      },
      // Timothy Pickering
      {
        name: 'Timothy Pickering',
        data: [
          {
            x: 'Secretary of State',
            y: [
              new Date(1795, 7, 20).getTime(),
              new Date(1800, 4, 12).getTime(),
            ],
          },
        ],
      },
      // Charles Lee
      {
        name: 'Charles Lee',
        data: [
          {
            x: 'Secretary of State',
            y: [
              new Date(1800, 4, 13).getTime(),
              new Date(1800, 5, 5).getTime(),
            ],
          },
        ],
      },
      // John Marshall
      {
        name: 'John Marshall',
        data: [
          {
            x: 'Secretary of State',
            y: [
              new Date(1800, 5, 13).getTime(),
              new Date(1801, 2, 4).getTime(),
            ],
          },
        ],
      },
      // Levi Lincoln
      {
        name: 'Levi Lincoln',
        data: [
          {
            x: 'Secretary of State',
            y: [new Date(1801, 2, 5).getTime(), new Date(1801, 4, 1).getTime()],
          },
        ],
      },
      // James Madison
      {
        name: 'James Madison',
        data: [
          {
            x: 'Secretary of State',
            y: [new Date(1801, 4, 2).getTime(), new Date(1809, 2, 3).getTime()],
          },
        ],
      },
    ],
    chart: {
      height: 350,
      type: 'rangeBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        rangeBarGroupRows: true,
      },
    },
    colors: ['#1c84ee', '#7f56da', '#ff86c8', '#f9b931', '#4ecac2'],
    fill: {
      type: 'solid',
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: false,
      },
    },
    legend: {
      position: 'right',
    },
  }
}
