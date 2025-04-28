import { Component } from '@angular/core';
import { GeneralSettingComponent } from './components/general-setting/general-setting.component';
import { StoreSettingComponent } from './components/store-setting/store-setting.component';
import { LocalizationSettingComponent } from './components/localization-setting/localization-setting.component';
import { CategorySettingComponent } from './components/category-setting/category-setting.component';
import { ReviewSettingComponent } from './components/review-setting/review-setting.component';
import { VoucherSettingComponent } from './components/voucher-setting/voucher-setting.component';
import { TaxSettingComponent } from './components/tax-setting/tax-setting.component';
import { CustomerSettingComponent } from './components/customer-setting/customer-setting.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    GeneralSettingComponent,
    StoreSettingComponent,
    LocalizationSettingComponent,
    CategorySettingComponent,
    ReviewSettingComponent,
    VoucherSettingComponent,
    TaxSettingComponent,
    CustomerSettingComponent,
  ],
  templateUrl: './settings.component.html',
  styles: ``,
})
export class SettingsComponent {
  title = 'Settings';
}
