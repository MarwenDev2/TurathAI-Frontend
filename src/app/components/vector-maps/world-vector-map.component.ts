import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core'
import { loadAllVectorMaps } from './vector-maps'
import JsVectorMap from 'jsvectormap'

declare global {
  interface Window {
    jsVectorMap?: any
  }
}

loadAllVectorMaps(JsVectorMap)

@Component({
  selector: 'app-world-vector-map',
  standalone: true,
  template:
    '<div [id]="mapId" [style.width]="width" [style.height]="height"></div>',
})
export class WorldVectorMapComponent implements AfterViewInit {
  @Input() width: string = ''
  @Input() height: string = ''
  @Input() options: Record<string, unknown> = {}
  @Input() type: string = ''
  @Input() mapId: string = 'map'

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      new (window as Window).jsVectorMap({
        selector: '#' + this.mapId,
        map: this.type,
        ...this.options,
      })
    }, 200)
  }
}
