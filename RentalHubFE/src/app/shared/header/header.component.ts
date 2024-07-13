import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { NotificationService } from '../notifications/notification.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { resDataDTO } from '../resDataDTO';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAvatarDialogComponent } from 'src/app/dashboard/update-avatar-dialog/update-avatar-dialog.component';
import { DisplayNotiDialogComponent } from '../display-noti-dialog/display-noti-dialog.component';
import { Pagination } from '../pagination/pagination.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input('matBadge')
  content: string | number | undefined | null;

  @Input('matTooltipClass')
  tooltipClass: any;

  isLoading = false;
  error: string = '';
  searchResultChangedSub: Subscription = new Subscription();
  user!: User | null;
  fullName!: string;
  isAuthenticatedUser: boolean = false;
  seenNotiList!: any;
  seenNotiPagination: Pagination = { page: 0, total: 1, limit: 10 };
  unseenNotificaionList!: any;
  unseenNotiPagination: Pagination = { page: 0, total: 1, limit: 10 };
  notificationTotals!: number;

  $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private postService: PostService,
    private accountService: AccountService,
    private notifierService: NotifierService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        console.log('On rendering headers...');
        this.isAuthenticatedUser = !!user;
        console.log('User is authenticated: ', this.isAuthenticatedUser);
        this.user = user;
        // this.notificationService.onReceivingNewNotificationToUpdate();
        if (this.user?._fname && this.user?._lname) {
          this.fullName = this.user?._fname + ' ' + this.user._lname;
        }
      });
    if (this.isAuthenticatedUser) {
      //Lấy các noti đã xem
      this.notificationService.getCurrentSeenNotifications
        .pipe(takeUntil(this.$destroy))
        .subscribe((notifications) => {
          if (notifications) {
            this.seenNotiList = notifications;
          } else {
            this.seenNotiList = [];
          }
        });
      //Lấy pagination của các noti đã xem
      this.notificationService.getSeenNotificationsPagination
        .pipe(takeUntil(this.$destroy))
        .subscribe((seenNotiPagination: any) => {
          this.seenNotiPagination = seenNotiPagination;
        });

      //Lấy các noti chưa xem
      this.notificationService.getCurrentUnseenNotifications
        .pipe(takeUntil(this.$destroy))
        .subscribe((unseenNotifications) => {
          if (unseenNotifications) {
            this.unseenNotificaionList = unseenNotifications;
          } else {
            this.unseenNotificaionList = [];
          }
        });
      //Lấy pagination của các noti chưa xem
      this.notificationService.getUnseenNotificationspagination
        .pipe(takeUntil(this.$destroy))
        .subscribe((unseenNotiPagination: Pagination) => {
          this.unseenNotiPagination = unseenNotiPagination;
        });

      //Lấy tổng các noti chưa xem
      this.notificationService.getTotalNotifications
        .pipe(takeUntil(this.$destroy))
        .subscribe((notificationTotal) => {
          this.notificationTotals = notificationTotal;
        });
    } else {
      this.notificationTotals = 0;
      this.notificationService.setCurrentSeenNotifications([]);
      this.notificationService.setCurrentUnseenNotifications([]);
    }
  }

  toMyPosting() {
    let uId = this.user?._id;
    this.router.navigate(['/profile/posting-history/', uId]);
  }

  toPostNew() {
    if (this.user !== null) {
      let uId = this.user?._id;
      this.router.navigate(['/profile/post-new/', uId]);
    } else {
      this.notifierService.notify('error', 'Vui lòng đăng nhập để đăng bài!');
    }
  }

  markAsReadAll() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn đánh dấu đã đọc tất cả thông báo?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.notificationService
        .markAsReadAll()
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Đánh dấu đã đọc toàn bộ thông báo thành công'
              );
            }
          },
          (errMsg) => {
            this.notifierService.notify(
              'error',
              'Đã có lỗi xảy ra, vui lòng thử lại sau'
            );
          }
        );
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  markAsRead(noti: any) {
    this.notificationService.markNotiFicationAsReadById(noti._id).subscribe();
  }

  seeMoreNoti(type: string) {
    switch (type) {
      case 'unseen':
        console.log('Getting more unseen notifications...');
        this.notificationService
          .getUnseenNotifications(
            this.unseenNotiPagination!.page + 1,
            this.unseenNotiPagination!.limit
          )
          .pipe(takeUntil(this.$destroy))
          .subscribe();
        break;
      case 'seen':
        console.log('Getting more seen notifications...');
        this.notificationService
          .getSeenNotifications(
            this.seenNotiPagination!.page + 1,
            this.seenNotiPagination!.limit
          )
          .pipe(takeUntil(this.$destroy))
          .subscribe();

        break;
      default:
        this.notificationService
          .getUnseenNotifications(
            this.seenNotiPagination!.page,
            this.seenNotiPagination!.limit
          )
          .pipe(takeUntil(this.$destroy))
          .subscribe();
    }
  }

  readNotiDetail(noti: any) {
    const dialog = this.dialog.open(DisplayNotiDialogComponent, {
      width: '600px',
      data: noti,
    });
  }

  onSearchByKeyword(searchForm: any) {
    console.log('Your keyword: ', searchForm.search);
    if (searchForm.search) {
      this.postService
        .searchPostsByKeyword(searchForm.search, 1, 5)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            this.postService.searchResultsChanged.next([...res.data]);
            console.log('On navigating to search result page...');
            this.router.navigate(
              [
                '/posts/search',
                {
                  keyword: searchForm.search,
                },
              ],
              {
                state: {
                  searchResult: res.data,
                  pagination: res.pagination,
                  keyword: searchForm.search,
                },
              }
            );
          },
          (errorMsg) => {
            this.isLoading = false;
            this.error = errorMsg;
            console.log(this.error);
            this.notifierService.notify('error', errorMsg);
          }
        );
    } else {
      this.router.navigate(['']).then(() => {
        window.location.reload();
      });
    }
  }

  toHome() {
    this.router.navigate(['']);
    // .then(() => {
    //   window.location.reload();
    // });
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
    this.notificationService.destroy();
  }

  logout() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Bạn có chắc muốn đăng xuất?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      let logoutObs: Observable<resDataDTO>;
      logoutObs = this.authService.logout(this.user?.RFToken);
      logoutObs.subscribe();
      this.router.navigate(['/auth/login']);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  updateAvatar() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(UpdateAvatarDialogComponent, {
      width: '400px',
      data: this.user?._avatar,
    });
  }
}
