import { Route } from '@angular/router';
import { BasicComponent } from './basic/basic.component'
import { CheckboxRadioComponent } from './checkbox-radio/checkbox-radio.component'
import { ChoicesComponent } from './choices/choices.component'
import { ClipboardComponent } from './clipboard/clipboard.component'
import { FlatepickerComponent } from './flatepicker/flatepicker.component'
import { ValidationComponent } from './validation/validation.component'
import { WizardComponent } from './wizard/wizard.component'
import { FileuploadsComponent } from './fileuploads/fileuploads.component'
import { EditorsComponent } from './editors/editors.component'
import { InputMaskComponent } from './input-mask/input-mask.component'
import { RangeSliderComponent } from './range-slider/range-slider.component'

export const FORMS_ROUTES: Route[] = [
  {
    path: 'basic',
    component: BasicComponent,
    data: { title: 'Form Basic Element' },
  },
  {
    path: 'checkbox-radio',
    component: CheckboxRadioComponent,
    data: { title: 'Checkbox & Radio' },
  },
  {
    path: 'choices',
    component: ChoicesComponent,
    data: { title: 'Form Select' },
  },
  {
    path: 'clipboard',
    component: ClipboardComponent,
    data: { title: 'Clipboard' },
  },
  {
    path: 'flatepicker',
    component: FlatepickerComponent,
    data: { title: 'Flatepicker' },
  },
  {
    path: 'validation',
    component: ValidationComponent,
    data: { title: 'Form Validation' },
  },
  {
    path: 'wizard',
    component: WizardComponent,
    data: { title: 'Wizard' },
  },
  {
    path: 'fileuploads',
    component: FileuploadsComponent,
    data: { title: 'File Uploads' },
  },
  {
    path: 'editors',
    component: EditorsComponent,
    data: { title: 'Editors' },
  },
  {
    path: 'input-mask',
    component: InputMaskComponent,
    data: { title: 'Input Mask' },
  },
  {
    path: 'range-slider',
    component: RangeSliderComponent,
    data: { title: 'Range Slider' },
  },
];
