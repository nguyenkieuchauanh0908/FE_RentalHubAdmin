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
    // {
    //   title: 'Hồ sơ cá nhân',
    //   icon: 'person',
    //   link: 'this.toMyAccount()',
    //   active: false,
    //   subTabs: false,
    // },
    // {
    //   title: 'Thông tin đăng nhập',
    //   icon: 'lock',
    //   link: 'this.toMyLoginDetail()',
    //   active: false,
    //   subTabs: false,
    // },
    {
      title: 'Thống kê',
      icon: 'poll',
      link: 'statistics',
      active: true,
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
      title: 'Chờ duyệt',
      icon: 'list',
      link: 'post-sensor',
      active: false,
      subTabs: false,
    },
    {
      title: 'Được duyệt',
      icon: 'check-circle',
      link: 'checked-posts',
      active: false,
      subTabs: false,
    },
    {
      title: 'Không được duyệt',
      icon: 'error',
      link: 'denied-posts',
      active: false,
      subTabs: false,
    },
    {
      title: 'Bị báo cáo',
      icon: 'report',
      link: 'reported-posts',
      active: false,
      subTabs: false,
    },
    // {
    //   title: 'Đăng xuất',
    //   icon: 'exit_to_app',
    //   link: 'this.logout()',
    //   active: false,
    //   subTabs: false,
    // },
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

  // toCheckPost() {
  //   console.log('toCheckPost...');
  //   this.router.navigate(['dashboard/post-sensor']);
  // }

  // toCheckedPost() {
  //   console.log('toCheckedPost...');
  //   this.router.navigate(['dashboard/checked-posts']);
  // }

  // deniedPost() {
  //   console.log('deniedPost...');
  //   this.router.navigate(['dashboard/denied-posts']);
  // }

  // reportedPost() {
  //   console.log('reportedPost...');
  //   this.router.navigate(['dashboard/reported-posts']);
  // }

  // toManageEmployees() {
  //   console.log('manage employees...');
  //   this.router.navigate(['dashboard/manage-employees']);
  // }

  // toStatistics() {
  //   console.log('to statistics dashboard...');
  //   this.router.navigate(['dashboard/statistics']);
  // }

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
