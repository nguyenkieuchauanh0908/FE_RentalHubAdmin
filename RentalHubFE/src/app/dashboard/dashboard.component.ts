import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AccountService } from '../accounts/accounts.service';
import { User } from '../auth/user.model';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { AccountEditDialogComponent } from './account-edit-dialog/account-edit-dialog.component';
import { UpdateAvatarDialogComponent } from './update-avatar-dialog/update-avatar-dialog.component';
import { LoginDetailUpdateDialogComponent } from './login-detail-update-dialog/login-detail-update-dialog.component';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { resDataDTO } from '../shared/resDataDTO';

export interface Tab {
  title: String;
  icon: String;
  active: boolean;
  link: string;
  subTabs: Array<Tab> | boolean;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  myProfile: User | null | undefined;

  tabs: Array<Tab> = [
    {
      title: 'Thống kê',
      icon: 'poll',
      link: 'statistics',
      active: false,
      subTabs: false,
    },
    {
      title: 'Quản lý nhân viên',
      icon: 'people',
      link: 'manage-employees',
      active: false,
      subTabs: false,
    },
    {
      title: 'Quản lý chủ trọ',
      icon: 'verified_user',
      link: 'manage-hosts',
      active: false,
      subTabs: false,
    },
    {
      title: 'Quản lý bài viết',
      icon: 'list',
      link: 'post-sensor',
      active: false,
      subTabs: false,
    },
  ];

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

  checkTabAndNavigate(activeTab: Tab) {
    this.tabs.forEach((currentTab) => {
      if (currentTab.title === activeTab.title) {
        currentTab.active = true;
      } else {
        currentTab.active = false;
      }
    });
    this.router.navigate(['dashboard/', activeTab.link]);
  }
}
