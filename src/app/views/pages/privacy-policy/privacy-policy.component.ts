import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrivacyPolicyComponent {
  title = 'Privacy Policy';
}
