import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { InputPasswordComponent } from '@commons/component/input-password';
import { StrengthMeterComponent } from '@commons/component/strength-meter';

import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { HeaderMenuSearchComponent } from './component/header-menu-search/header-menu-search.component';
import { HeaderNotifyComponent } from './component/header-notify/header-notify.component';
import { HeaderUsernameComponent } from './component/header-username/header-username.component';
import { LayoutService } from './component/layout.service';
import { PageProgressComponent } from './component/page-progress/page-progress.component';
import { SliderMenuComponent } from './component/slider-menu/slider-menu.component';
import { TabContextmenuComponent } from './component/tab-contextmenu/tab-contextmenu.component';
import { UpdatePasswordComponent } from './component/update-password/update-password.component';
import { LayoutRouting } from './layout-routing';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    BaseLayoutComponent,
    PageProgressComponent,
    TabContextmenuComponent,
    UpdatePasswordComponent,
    HeaderNotifyComponent,
    HeaderMenuSearchComponent,
    HeaderUsernameComponent,
    SliderMenuComponent,
    LayoutComponent
  ],
  imports: [
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzDropDownModule,
    NzProgressModule,
    NzTypographyModule,
    NzAlertModule,
    NzListModule,
    NzCardModule,
    NzResizableModule,
    StrengthMeterComponent,
    NzTabsModule,
    NzAutocompleteModule,
    NzPopoverModule,
    NzFormModule,
    ReactiveFormsModule,
    InputPasswordComponent,
    NzBreadCrumbModule,
    NzxDirectiveModule,
    NgIf,
    NgForOf,
    NzIconModule,
    LayoutRouting,
    FormsModule,
    NzInputModule,
    NgTemplateOutlet
  ],
  providers: [LayoutService]
})
export class LayoutModule {}
