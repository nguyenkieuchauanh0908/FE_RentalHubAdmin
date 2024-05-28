import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { HostService } from '../host.service';
import { HostIdCard } from '../hostIdCard.model';
import { CommentReasonDialogComponent } from 'src/app/shared/comment-reason-dialog/comment-reason-dialog.component';

@Component({
  selector: 'app-host-sensor-dialog',
  templateUrl: './host-sensor-dialog.component.html',
  styleUrls: ['./host-sensor-dialog.component.scss'],
})
export class HostSensorDialogComponent {
  isLoading = false;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  hostDetailIdCard!: HostIdCard;

  sensorResult = new EventEmitter();
  denySensorResult = new EventEmitter();

  constructor(
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private hostService: HostService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.hostService.getActiveHostDetailByUId(this.data.hostId).subscribe(
      (res) => {
        if (res.data) {
          this.hostDetailIdCard = res.data;
          console.log(
            '🚀 ~ HostSensorDialogComponent ~ ngOnInit ~ this.hostDetailIdCard:',
            this.hostDetailIdCard
          );
        }
      },
      (errMsg) => {
        this.notifierService.notify(
          'error',
          'Đã có lỗi xảy ra, vui lòng thử lại sau!'
        );
      }
    );
  }

  deny() {
    const dialogRef = this.dialog.open(CommentReasonDialogComponent, {
      width: '400px',
      data: 'Lý do từ chối duyệt',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(
      (reason: string) => {
        this.isLoading = true;
        this.hostService
          .sensorHostRequest(this.hostDetailIdCard._id, 2, reason)
          .subscribe(
            (res) => {
              if (res.data) {
                this.isLoading = false;
                this.denySensorResult.emit(this.hostDetailIdCard._id);
                this.notifierService.hideAll();
                this.notifierService.notify(
                  'success',
                  'Từ chối duyệt thành công!'
                );
              }
            },
            (errMsg) => {
              this.isLoading = false;
            }
          );
      }
    );
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  sensor() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận duyệt?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.isLoading = true;
      this.hostService
        .sensorHostRequest(
          this.hostDetailIdCard._id,
          1,
          'Thông tin CCCD/CMT hợp lệ'
        )
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.sensorResult.emit(this.hostDetailIdCard._id);
              this.notifierService.hideAll();
              this.notifierService.notify(
                'success',
                'Duyệt hồ sơ chủ trọ thành công!'
              );
            }
          },
          (errMsg) => {
            this.isLoading = false;
          }
        );
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
