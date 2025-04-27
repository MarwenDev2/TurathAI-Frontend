import { calculateTimeToEvent } from '@/app/helper/utils'
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'
import { interval, type Subscription } from 'rxjs'

@Component({
  selector: 'app-comingsoon',
  standalone: true,
  imports: [RouterLink,LogoBoxComponent],
  templateUrl: './comingsoon.component.html',
  styles: ``
})
export class ComingsoonComponent {
  _days?: number
  _hours?: number
  _minutes?: number
  _seconds?: number
  countdown: { days: number; hours: number; minutes: number; seconds: number } =
    {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  private intervalSubscription!: Subscription

  ngOnInit(): void {
    this.countdown = calculateTimeToEvent()
    this.intervalSubscription = interval(1000).subscribe(() => {
      this.countdown = calculateTimeToEvent()
    })
  }

  ngOnDestroy(): void {
    this.intervalSubscription.unsubscribe()
  }
}
