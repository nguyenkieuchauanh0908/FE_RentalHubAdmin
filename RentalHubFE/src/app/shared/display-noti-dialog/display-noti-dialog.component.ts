import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-display-noti-dialog',
  templateUrl: './display-noti-dialog.component.html',
  styleUrls: ['./display-noti-dialog.component.scss'],
})
export class DisplayNotiDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    public notifier: NotifierService
  ) {}

  markAsRead() {
    this.notificationService
      .markNotiFicationAsReadById(this.data._id)
      .subscribe((res) => {
        if (res.data) {
          this.notifier.notify(
            'success',
            'Đánh dấu thông báo đã đọc thành công!'
          );
        }
      });
  }
}
