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
  displayedColumns: string[] = ['image', 'title', 'author', 'email', 'time'];
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
  currentPostStatus: number | null = 2;

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
    this.currentPostStatus = 2;
    this.currentPage = 1;
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
    if (!this.onSearching) {
      this.loadData(this.currentPostStatus);
    }
    this.isLoading = false;
  }

  //chỉ dùng khi không đang tìm kiếm
  loadData(postStatus: number | null) {
    this.isLoading = true;
    //Nếu không đang tìm kiếm
    if (!this.onSearching) {
      //Lấy post bị reported
      if (postStatus === 2) {
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
      //Lấy toàn bộ post
      else {
        this.forumService
          .getSocialPostStatus(postStatus, this.currentPage, this.pageItemLimit)
          .pipe(takeUntil(this.$destroy))
          .subscribe((res) => {
            if (res.data) {
              this.dataSource = res.data;
              this.totalPages = res.pagination.total;
              this.isLoading = false;
            }
          });
      }
    }
    this.isLoading = false;
  }

  seePost(post: any) {
    console.log('Seeing post detail....');
    // window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ForumPostSensorDialogComponent, {
      width: '1000px',
      data: post,
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
    if (!onSearching) {
      this.loadData(this.currentPostStatus);
    } else {
      this.getPostByKeyword(
        this.searchKeyword!,
        this.currentPage,
        this.pageItemLimit
      );
    }
  }

  toPosts(type: string): void {
    this.dataSource = [];
    this.currentPage = 1;
    this.totalPages = 0;
    switch (type) {
      case 'Tất cả':
        this.currentPostStatus = null;
        break;
      case 'Bị báo cáo':
        this.currentPostStatus = 2;
        break;
      default:
        this.currentPostStatus = 2;
    }
    this.reloadData();
  }

  reloadData() {
    this.isLoading = true;
    this.searchKeyword = null;
    this.onSearching = false;
    this.currentPage = 1;
    this.loadData(this.currentPostStatus);
  }

  search(form: any) {
    this.isLoading = true;
    this.onSearching = true;
    this.currentPage = 1;
    if (form.keyword) {
      this.searchKeyword = form.keyword;
      this.getPostByKeyword(
        this.searchKeyword!,
        this.currentPage,
        this.pageItemLimit
      );
    }
  }

  getPostByKeyword(keyword: string, page: number, limit: number) {
    this.forumService
      .getByPostIdOrEmail(keyword, page, limit)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            this.isLoading = false;
            this.dataSource = [];
            this.currentPage = res.pagination.page;
            this.totalPages = res.pagination.total;
            this.dataSource = res.data;
            console.log(
              '🚀 ~ ManageForumComponent ~ getPostByKeyword ~ this.dataSource:',
              this.dataSource
            );
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
