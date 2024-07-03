import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from '../manage-post-sensor/post-sensor-dialog/post-sensor-dialog.component';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-manage-manage-reported-posts',
  templateUrl: './manage-reported-posts.component.html',
  styleUrls: ['./manage-reported-posts.component.scss'],
})
export class ManageReportedPostsComponent implements OnInit, OnDestroy {
  isLoading = false;
  $destroy: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = [
    'image',
    'title',
    'desc',
    'author',
    'lastUpdate',
  ];
  dataSource!: PostItem[];
  onSearching: boolean = false;
  searchKeyword: string | null = null;
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;

  constructor(
    private postService: PostService,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private router: Router,
    private notifierService: NotifierService
  ) {}
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.currentPage = 1;
    if (!this.onSearching) {
      this.postService.getReportPostList(1, 5).subscribe(
        (res) => {
          this.dataSource = res.data;
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        },
        (errMsg) => {
          this.isLoading = false;
        }
      );
    } else {
      this.postService
        .findPostByIdAndStatus(
          this.searchKeyword!,
          '4',
          this.currentPage,
          this.pageItemLimit
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.dataSource = [];
              this.totalPages = res.pagination.total;
              this.dataSource = res.data;
            }
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            this.notifierService.notify(
              'error',
              'Không có kết quả tìm kiếm trùng khớp!'
            );
          }
        );
    }
  }

  toPosts(type: string): void {
    switch (type) {
      case 'Chờ duyệt':
        this.router.navigate(['/dashboard/post-sensor']);
        break;
      case 'Đã duyệt':
        this.router.navigate(['/dashboard/checked-posts']);
        break;
      case 'Không được duyệt':
        this.router.navigate(['/dashboard/denied-posts']);
        break;
      case 'Bị báo cáo':
        this.router.navigate(['/dashboard/reported-posts']);
        break;
      default:
    }
  }

  seePost(postDetail: any) {
    let post = postDetail;
    if (postDetail._status === 1) {
      this.postService.getReportPostById(postDetail._id).subscribe((res) => {
        if (res.data) {
          post = res.data;
          //Nếu đã lấy được thông tin của post thì open sensor dialog
          if (post) {
            window.scrollTo(0, 0); // Scrolls the page to the top
            const dialogRef = this.dialog.open(PostSensorDialogComponent, {
              width: '1000px',
              data: post,
            });

            let sub = dialogRef.componentInstance.sensorResult.subscribe(
              (postId) => {
                if (this.dataSource) {
                  this.dataSource = this.dataSource.filter(
                    (post: PostItem) => post._id !== postId
                  );
                }
              }
            );
            sub = dialogRef.componentInstance.denySensorResult.subscribe(
              (postId) => {
                if (this.dataSource) {
                  this.dataSource = this.dataSource.filter(
                    (post: PostItem) => post._id !== postId
                  );
                }
              }
            );

            dialogRef.afterClosed().subscribe((result) => {
              sub.unsubscribe();
            });
          }
        }
      });
    }
  }

  //position can be either 1 (navigate to next page) or -1 (to previous page)
  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean,
    onSearching: boolean
  ) {
    this.isLoading = true;
    //To next page or previous page
    if (position === 1 || position === -1) {
      this.currentPage = this.paginationService.navigatePage(
        position,
        this.currentPage
      );
    }

    //To 1st page or last page
    if (toFirstPage) {
      this.currentPage = 1;
    } else if (toLastPage) {
      this.currentPage = this.totalPages;
    }

    //Call API to get the corresponding data for the current page
    if (!this.onSearching) {
      this.postService
        .getReportPostList(this.currentPage, this.pageItemLimit)
        .subscribe(
          (res) => {
            this.dataSource = res.data;
            this.totalPages = res.pagination.total;
            this.isLoading = false;
          },
          (errMsg) => {
            this.isLoading = false;
          }
        );
    } else {
      this.postService
        .findPostByIdAndStatus(
          this.searchKeyword!,
          '4',
          this.currentPage,
          this.pageItemLimit
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.dataSource = [];
              this.totalPages = res.pagination.total;
              this.dataSource = res.data;
            }
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            this.notifierService.notify(
              'error',
              'Không có kết quả tìm kiếm trùng khớp!'
            );
          }
        );
    }
  }

  reloadData() {
    this.isLoading = true;
    this.onSearching = false;
    this.searchKeyword = null;
    this.currentPage = 1;
    this.postService
      .getReportPostList(1, this.pageItemLimit)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          this.dataSource = res.data;
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        },
        (errMsg) => {
          this.isLoading = false;
        }
      );
  }

  search(form: any) {
    this.isLoading = true;
    this.onSearching = true;
    if (form.keyword) {
      this.searchKeyword = form.keyword;
      this.postService
        .findPostByIdAndStatus(this.searchKeyword!, '4', 1, this.pageItemLimit)
        .pipe(takeUntil(this.$destroy))
        .subscribe(
          (res) => {
            if (res.data) {
              this.isLoading = false;
              this.dataSource = [];
              this.currentPage = 1;
              this.totalPages = res.pagination.total;
              this.dataSource = res.data;
            }
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            this.notifierService.notify(
              'error',
              'Không có kết quả tìm kiếm trùng khớp!'
            );
          }
        );
    }
  }
}
