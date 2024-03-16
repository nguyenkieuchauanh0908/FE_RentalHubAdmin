import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-update-employee-login-detail-dialog',
  templateUrl: './update-employee-login-detail-dialog.component.html',
  styleUrls: ['./update-employee-login-detail-dialog.component.scss'],
})
export class UpdateEmployeeLoginDetailDialogComponent {
  password: string = 'password';
  confirmPassword: string = 'password';
  isPwShown: boolean = false;
  isConfirmPwShown: boolean = false;
  isLoading = false;
  error: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.password = 'password';
    this.confirmPassword = 'password';
  }

  saveChanges(form: any) {
    console.log('On saving updates on employee account details...', form);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận cập nhật thông tin?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.isLoading = true;
      this.accountService
        .updateInspectorPass(this.data._id, form.pw, form.repw)
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.notifierService.notify(
                'success',
                'Cập nhật thông tin đăng nhập nhân viên thành công!'
              );
              this.dialog.closeAll();
            }
          },
          (errorMsg) => {
            this.isLoading = false;
            this.error = errorMsg;
            console.log(this.error);
            this.notifierService.notify('error', errorMsg);
          }
        );
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  onEyesSeePwClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.isPwShown = true;
    } else {
      this.password = 'password';
      this.isPwShown = false;
    }
  }

  onEyesSeeConfirmPwClick() {
    if (this.confirmPassword === 'password') {
      this.confirmPassword = 'text';
      this.isConfirmPwShown = true;
    } else {
      this.confirmPassword = 'password';
      this.isConfirmPwShown = false;
    }
  }
}
