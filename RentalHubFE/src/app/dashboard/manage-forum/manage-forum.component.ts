import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from '../manage-post-sensor/post-sensor-dialog/post-sensor-dialog.component';
import { ForumService } from './forum.service';
import { ForumPostSensorDialogComponent } from './forum-post-sensor-dialog/forum-post-sensor-dialog.component';

@Component({
  selector: 'app-manage-forum',
  templateUrl: './manage-forum.component.html',
  styleUrls: ['./manage-forum.component.scss'],
})
export class ManageForumComponent implements OnInit, OnDestroy {
  isLoading = false;
  $destroy: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = [
    'image',
    'title',
    'reasons',
    'author',
    'email',
    'reportersNumber',
  ];
  dataSource!: any[];
  onSearching: boolean = false;
  searchKeyword: string | null = null;
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: any[] = new Array<any>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  sourceTags: Set<Tags> = new Set();

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private router: Router,
    private notifierService: NotifierService,
    private forumService: ForumService
  ) {}
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.currentPage = 1;
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
    if (!this.onSearching) {
      this.loadData();
    } else {
      // this.postService
      //   .findPostByIdAndStatus(
      //     this.searchKeyword!,
      //     '0',
      //     this.currentPage,
      //     this.pageItemLimit
      //   )
      //   .pipe(takeUntil(this.$destroy))
      //   .subscribe(
      //     (res) => {
      //       if (res.data) {
      //         this.isLoading = false;
      //         this.dataSource = [];
      //         this.totalPages = res.pagination.total;
      //         this.dataSource = res.data;
      //       }
      //       this.isLoading = false;
      //     },
      //     (err) => {
      //       this.isLoading = false;
      //       this.notifierService.notify(
      //         'error',
      //         'Không có kết quả tìm kiếm trùng khớp!'
      //       );
      //     }
      //   );
    }
  }

  loadData() {
    this.forumService
      .getReportedSocialPosts(this.currentPage, this.pageItemLimit)
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.dataSource = res.data;
          this.totalPages = res.pagination.total;
          this.isLoading = false;
        }
      });
  }

  seePost(post: any) {
    console.log('Seeing post detail....');
    const dialogRef = this.dialog.open(ForumPostSensorDialogComponent, {
      width: '1000px',
      data: {
        _reportId: post._id,
        _title: post._title,
        _content: post._content,
        _image: post._image,
      },
    });
    let sub = dialogRef.componentInstance.postLocked.subscribe((reportId) => {
      console.log('🚀 ~ ManageForumComponent ~ sub ~ reportId:', reportId);
      if (this.dataSource) {
        this.dataSource = this.dataSource.filter(
          (reportReq: any) => reportReq._id !== reportId
        );
      }
    });
    console.log(
      '🚀 ~ ManageForumComponent ~ sub ~ this.dataSource:',
      this.dataSource
    );

    dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
    });
  }

  //position can be either 1 (navigate to next page) or -1 (to previous page)
  changeCurrentPage(
    position: number,
    toFirstPage: boolean,
    toLastPage: boolean,
    onSearching: boolean
  ) {
    this.isLoading = true;
    if (position === 1 || position === -1) {
      this.currentPage = this.paginationService.navigatePage(
        position,
        this.currentPage
      );
    }
    if (toFirstPage) {
      this.currentPage = 1;
    } else if (toLastPage) {
      this.currentPage = this.totalPages;
    }
    if (onSearching) {
      this.loadData();
    } else {
      // this.postService
      //   .findPostByIdAndStatus(
      //     this.searchKeyword!,
      //     '0',
      //     this.currentPage,
      //     this.pageItemLimit
      //   )
      //   .pipe(takeUntil(this.$destroy))
      //   .subscribe(
      //     (res) => {
      //       if (res.data) {
      //         this.isLoading = false;
      //         this.dataSource = [];
      //         this.totalPages = res.pagination.total;
      //         this.dataSource = res.data;
      //       }
      //       this.isLoading = false;
      //     },
      //     (err) => {
      //       this.isLoading = false;
      //       this.notifierService.notify(
      //         'error',
      //         'Không có kết quả tìm kiếm trùng khớp!'
      //       );
      //     }
      //   );
    }
  }

  toPosts(type: string): void {
    // switch (type) {
    //   case 'Chờ duyệt':
    //     this.router.navigate(['/dashboard/post-sensor']);
    //     break;
    //   case 'Đã duyệt':
    //     this.router.navigate(['/dashboard/checked-posts']);
    //     break;
    //   case 'Không được duyệt':
    //     this.router.navigate(['/dashboard/denied-posts']);
    //     break;
    //   case 'Bị báo cáo':
    //     this.router.navigate(['/dashboard/reported-posts']);
    //     break;
    //   default:
    // }
  }

  reloadData() {
    this.isLoading = true;
    this.searchKeyword = null;
    this.onSearching = false;
    this.currentPage = 1;
    this.loadData();
  }

  search(form: any) {
    this.isLoading = true;
    this.onSearching = true;
    if (form.keyword) {
      this.searchKeyword = form.keyword;
      // this.postService
      //   .findPostByIdAndStatus(this.searchKeyword!, '0', 1, this.pageItemLimit)
      //   .pipe(takeUntil(this.$destroy))
      //   .subscribe(
      //     (res) => {
      //       if (res.data) {
      //         this.isLoading = false;
      //         this.dataSource = [];
      //         this.currentPage = 1;
      //         this.totalPages = res.pagination.total;
      //         this.dataSource = res.data;
      //       }
      //       this.isLoading = false;
      //     },
      //     (err) => {
      //       this.isLoading = false;
      //       this.notifierService.notify(
      //         'error',
      //         'Không có kết quả tìm kiếm trùng khớp!'
      //       );
      //     }
      //   );
    }
  }
}
