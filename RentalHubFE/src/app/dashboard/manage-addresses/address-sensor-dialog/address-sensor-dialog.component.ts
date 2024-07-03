import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { CommentReasonDialogComponent } from 'src/app/shared/comment-reason-dialog/comment-reason-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { HostService } from '../../manage-hosts/host.service';
import { AddressService } from '../address.service';
import { AddressReqModel } from '../addressReq.model';

@Component({
  selector: 'app-address-sensor-dialog',
  templateUrl: './address-sensor-dialog.component.html',
  styleUrls: ['./address-sensor-dialog.component.scss'],
})
export class AddressSensorDialogComponent {
  isLoading = false;
  profile!: User | null;
  currentUid!: string | null;
  myProfile!: User | null;
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  addressReqDetail!: AddressReqModel;

  sensorResult = new EventEmitter();
  denySensorResult = new EventEmitter();

  constructor(
    private notifierService: NotifierService,
    public dialog: MatDialog,
    private hostService: HostService,
    private addressService: AddressService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.addressService
      .getAddressRequestDetailById(this.data.addressId, null)
      .subscribe(
        (res) => {
          if (res.data) {
            this.addressReqDetail = res.data;
          }
        },
        (errMsg) => {
          console.log(
            '🚀 ~ HostSensorDialogComponent ~ ngOnInit ~ errMsg:',
            errMsg
          );
        }
      );
  }

  deny() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(CommentReasonDialogComponent, {
      width: '400px',
      data: 'Lý do từ chối duyệt',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(
      (reason: string) => {
        this.isLoading = true;
        this.addressService
          .sensorAddressRequest(this.addressReqDetail._id, 2, reason)
          .subscribe(
            (res) => {
              if (res.data) {
                this.isLoading = false;
                this.denySensorResult.emit(this.addressReqDetail._id);
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
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận duyệt?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.isLoading = true;
      this.addressService
        .sensorAddressRequest(
          this.data.addressId,
          1,
          'Thông tin địa chỉ khớp với hồ sơ'
        )
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.sensorResult.emit(this.addressReqDetail._id);
              this.notifierService.hideAll();
              this.notifierService.notify(
                'success',
                'Duyệt yêu cầu thành công!'
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
