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
import { CommentReasonDialogComponent } from './comment-reason-dialog/comment-reason-dialog.component';
import { DisplayNotiDialogComponent } from './display-noti-dialog/display-noti-dialog.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { ChatWithComponent } from './chat-bot/chat-with/chat-with.component';
import { ChatUserComponent } from './chat-bot/chat-user/chat-user.component';
import { SendForgetPwEmailComponent } from './send-forget-pw-email/send-forget-pw-email.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SliderComponent } from './slider/slider.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { ChatFilterPipe } from './pipe/chat-filter.pipe';
import { LinkyModule } from 'ngx-linky';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PaginationComponent,
    MainLayoutComponent,
    ConfirmDialogComponent,
    TotalDataComponent,
    CommentReasonDialogComponent,
    DisplayNotiDialogComponent,
    ChatBotComponent,
    ChatWithComponent,
    ChatUserComponent,
    SendForgetPwEmailComponent,
    SliderComponent,
    ChatFilterPipe,
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
    RichTextEditorModule,
    NgImageSliderModule,
    LinkyModule,
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
    ChatBotComponent,
    RichTextEditorModule,
    SliderComponent,
    NgImageSliderModule,
    ChatFilterPipe,
    LinkyModule,
  ],
})
export class SharedModule {}
