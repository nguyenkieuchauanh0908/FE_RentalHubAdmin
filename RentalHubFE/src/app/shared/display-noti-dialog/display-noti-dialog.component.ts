import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { NotificationService } from '../notifications/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-noti-dialog',
  templateUrl: './display-noti-dialog.component.html',
  styleUrls: ['./display-noti-dialog.component.scss'],
})
export class DisplayNotiDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    public notifier: NotifierService,
    private router: Router,
    private dialog: MatDialog
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

  redirectoManagement(type: string) {
    switch (type) {
      case 'ACTIVE_HOST':
        this.router.navigate(['/dashboard/manage-hosts']);
        break;
      case 'REGISTER_ADDRESS':
        this.router.navigate(['/dashboard/manage-addresses']);
        break;
      case 'UPDATE_ADDRESS':
        this.router.navigate(['/dashboard/manage-addresses']);
        break;
      case 'CREATE_POST':
        this.router.navigate(['/dashboard/post-sensor']);
        break;
      case 'NEW_REPORT_POST':
        this.router.navigate(['/dashboard/reported-posts']);
        break;
      case 'NEW_REPORT_SOCIAL_POST':
        this.router.navigate(['/dashboard/manage-forum']);
        break;
      default:
        this.dialog.closeAll();
        this.notifier.notify(
          'warning',
          'Thông báo này không còn tồn tại hoặc đã được xóa thủ công!'
        );
    }
  }
}
