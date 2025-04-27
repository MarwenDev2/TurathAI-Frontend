import { Route } from '@angular/router'
import { AreaComponent } from './area/area.component'
import { BarComponent } from './bar/bar.component'
import { BubbleComponent } from './bubble/bubble.component'
import { CandlestickComponent } from './candlestick/candlestick.component'
import { ColumnComponent } from './column/column.component'
import { HeatmapComponent } from './heatmap/heatmap.component'
import { LineComponent } from './line/line.component'
import { MixedComponent } from './mixed/mixed.component'
import { TimelineComponent } from './timeline/timeline.component'
import { BoxplotComponent } from './boxplot/boxplot.component'
import { TreemapComponent } from './treemap/treemap.component'
import { PieComponent } from './pie/pie.component'
import { RadarComponent } from './radar/radar.component'
import { RadialbarComponent } from './radialbar/radialbar.component'
import { ScatterComponent } from './scatter/scatter.component'
import { PolarAreaComponent } from './polar-area/polar-area.component'

export const CHART_ROUTES: Route[] = [
  {
    path: 'area',
    component: AreaComponent,
    data: { title: 'Apex Area Chart' },
  },
  {
    path: 'bar',
    component: BarComponent,
    data: { title: 'Apex Bar Chart' },
  },
  {
    path: 'bubble',
    component: BubbleComponent,
    data: { title: 'Apex Bubble Chart' },
  },
  {
    path: 'candlestick',
    component: CandlestickComponent,
    data: { title: 'Apex Candlestick Chart' },
  },
  {
    path: 'column',
    component: ColumnComponent,
    data: { title: 'Apex Column Chart' },
  },
  {
    path: 'heatmap',
    component: HeatmapComponent,
    data: { title: 'Apex Heatmap Chart' },
  },
  {
    path: 'line',
    component: LineComponent,
    data: { title: 'Apex Line Chart' },
  },
  {
    path: 'mixed',
    component: MixedComponent,
    data: { title: 'Apex Mixed Chart' },
  },
  {
    path: 'timeline',
    component: TimelineComponent,
    data: { title: 'Apex Timeline Chart' },
  },
  {
    path: 'boxplot',
    component: BoxplotComponent,
    data: { title: 'Apex Boxplot Chart' },
  },
  {
    path: 'treemap',
    component: TreemapComponent,
    data: { title: 'Apex Treemap Chart' },
  },
  {
    path: 'pie',
    component: PieComponent,
    data: { title: 'Apex Pie Chart' },
  },
  {
    path: 'radar',
    component: RadarComponent,
    data: { title: 'Apex Radar Chart' },
  },
  {
    path: 'radialbar',
    component: RadialbarComponent,
    data: { title: 'Apex Radialbar Chart' },
  },
  {
    path: 'scatter',
    component: ScatterComponent,
    data: { title: 'Apex Scatter Chart' },
  },
  {
    path: 'polar-area',
    component: PolarAreaComponent,
    data: { title: 'Apex Polar Area Chart' },
  }
]
