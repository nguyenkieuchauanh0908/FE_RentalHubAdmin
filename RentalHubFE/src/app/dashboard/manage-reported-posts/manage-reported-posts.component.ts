import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from '../manage-post-sensor/post-sensor-dialog/post-sensor-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-manage-reported-posts',
  templateUrl: './manage-reported-posts.component.html',
  styleUrls: ['./manage-reported-posts.component.scss'],
})
export class ManageReportedPostsComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[] = [
    'image',
    'title',
    'desc',
    'author',
    'lastUpdate',
  ];
  dataSource!: PostItem[];
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: PostItem[] = new Array<PostItem>();
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
    private router: Router
  ) {
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.postService.getReportPostList(1, 5).subscribe(
      (res) => {
        this.dataSource = res.data;
        console.log(
          '🚀 ~ file: post-sensor.component.ts:49 ~ PostSensorComponent ~ this.postService.getPostsHistory ~  this.dataSource:',
          this.dataSource
        );
        this.totalPages = res.pagination.total;
        this.isLoading = false;
      },
      (errMsg) => {
        this.isLoading = false;
      }
    );
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
          console.log(
            '🚀 ~ ReportedPostsComponent ~ this.postService.getReportPostById ~ post:',
            post
          );
          //Nếu đã lấy được thông tin của post thì open sensor dialog
          if (post) {
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
    toLastPage: boolean
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
    this.postService.getReportPostList(1, 5).subscribe(
      (res) => {
        this.dataSource = res.data;
        console.log(
          '🚀 ~ file: post-sensor.component.ts:49 ~ PostSensorComponent ~ this.postService.getPostsHistory ~  this.dataSource:',
          this.dataSource
        );
        this.totalPages = res.pagination.total;
        this.isLoading = false;
      },
      (errMsg) => {
        this.isLoading = false;
      }
    );
  }
}
