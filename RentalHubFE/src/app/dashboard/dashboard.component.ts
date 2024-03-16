import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AccountService } from '../accounts/accounts.service';
import { User } from '../auth/user.model';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { PostSensorDialogComponent } from './post-sensor/post-sensor-dialog/post-sensor-dialog.component';
import { AccountEditDialogComponent } from './account-edit-dialog/account-edit-dialog.component';
import { UpdateAvatarDialogComponent } from './update-avatar-dialog/update-avatar-dialog.component';
import { LoginDetailUpdateDialogComponent } from './login-detail-update-dialog/login-detail-update-dialog.component';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { resDataDTO } from '../shared/resDataDTO';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  myProfile: User | null | undefined;
  constructor(
    private router: Router,
    private authService: AuthService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accountService.getCurrentUser.subscribe((user) => {
      this.myProfile = user;
    });
  }

  toCheckPost() {
    console.log('toCheckPost...');
    this.router.navigate(['dashboard/post-sensor']);
  }

  toCheckedPost() {
    console.log('toCheckedPost...');
    this.router.navigate(['dashboard/history-checked-posts']);
  }

  deniedPost() {
    console.log('deniedPost...');
    this.router.navigate(['dashboard/history-denied-posts']);
  }

  reportedPost() {
    console.log('reportedPost...');
    this.router.navigate(['dashboard/reported-posts']);
  }

  toMyAccount() {
    const dialogRef = this.dialog.open(AccountEditDialogComponent, {
      width: '400px',
      data: this.myProfile,
    });
  }

  toMyLoginDetail() {
    const dialogRef = this.dialog.open(LoginDetailUpdateDialogComponent, {
      width: '400px',
      data: this.myProfile?._email,
    });
  }

  logout() {
    console.log('On logging out...');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn đăng xuất?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      let logoutObs: Observable<resDataDTO>;
      logoutObs = this.authService.logout(this.myProfile?.RFToken);
      logoutObs.subscribe();
      this.router.navigate(['/auth/login']);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  updateAvatar() {
    const dialogRef = this.dialog.open(UpdateAvatarDialogComponent, {
      width: '400px',
      data: this.myProfile?._avatar,
    });
  }

  toManageEmployees() {
    console.log('manage employees...');
    this.router.navigate(['dashboard/manage-employees']);
  }
}
