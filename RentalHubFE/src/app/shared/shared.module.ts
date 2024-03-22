import { NgModule, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialsModule } from './ng-materials/ng-materials.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination/pagination.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NotifierModule } from 'angular-notifier';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TotalDataComponent } from '../dashboard/statistics/total-data/total-data.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PaginationComponent,

    MainLayoutComponent,
    ConfirmDialogComponent,
    TotalDataComponent,
  ],
  imports: [
    CommonModule,
    NgMaterialsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    NotifierModule,
    NgxChartsModule,
  ],
  exports: [
    CommonModule,
    ScrollingModule,
    NgMaterialsModule,
    HeaderComponent,
    FooterComponent,
    RouterModule,
    PaginationComponent,
    MainLayoutComponent,
    NotifierModule,
    ReactiveFormsModule,
    NgxChartsModule,
    TotalDataComponent,
  ],
})
export class SharedModule {}
