import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AccountService } from 'src/app/accounts/accounts.service';

import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-new-employee-dialog',
  templateUrl: './add-new-employee-dialog.component.html',
  styleUrls: ['./add-new-employee-dialog.component.scss'],
})
export class AddNewEmployeeDialogComponent {
  newInspector = new EventEmitter();

  password: string = 'password';
  confirmPassword: string = 'password';
  isPwShown: boolean = false;
  isConfirmPwShown: boolean = false;
  isLoading = false;
  error: string = '';

  constructor(
    private accountService: AccountService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.password = 'password';
    this.confirmPassword = 'password';
  }

  saveChanges(form: any) {
    console.log('On creating new inspector accounts...', form);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận thông tin?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.isLoading = true;
      this.accountService
        .addNewInspector(form.email, form.pw, form.repw)
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.newInspector.emit(res.data);
              this.notifierService.notify(
                'success',
                'Thêm tài khoản kiểm duyệt thành công!'
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
