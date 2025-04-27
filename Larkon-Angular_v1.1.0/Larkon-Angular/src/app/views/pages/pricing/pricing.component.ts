import { Component } from '@angular/core';
import { PricingPlans } from './data'

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [],
  templateUrl: './pricing.component.html',
  styles: ``
})
export class PricingComponent {
  title="Pricing"
  plans = PricingPlans
}
