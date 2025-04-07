import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexAnnotations,
  ApexGrid,
  ApexStates,
  ApexMarkers,
  ApexTheme,
} from 'ng-apexcharts'

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  fill: ApexFill
  stroke: ApexStroke
  tooltip: ApexTooltip
  dataLabels: ApexDataLabels
  plotOptions: ApexPlotOptions
  markers: ApexMarkers
  responsive: ApexResponsive[]
  colors: string[]
  labels: string[]
  annotations: ApexAnnotations
  yaxis: ApexYAxis | ApexYAxis[]
  grid: ApexGrid
  legend: ApexLegend
  title: ApexTitleSubtitle
  subtitle: ApexTitleSubtitle
  states: ApexStates
  theme: ApexTheme
}
