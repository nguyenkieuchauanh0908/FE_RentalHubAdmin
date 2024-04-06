import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { Tags } from 'src/app/shared/tags/tag.model';
import { PostSensorDialogComponent } from '../post-sensor/post-sensor-dialog/post-sensor-dialog.component';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-checked-posts',
  templateUrl: './history-checked-posts.component.html',
  styleUrls: ['./history-checked-posts.component.scss'],
})
export class HistoryCheckedPostsComponent {
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
    private notifierService: NotifierService,
    private paginationService: PaginationService,
    private router: Router
  ) {
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.currentUid = this.accountService.getCurrentUserId();
    this.postService.getPostAdmin(1, 1, 5).subscribe(
      (res) => {
        this.isLoading = false;
        this.dataSource = res.data;
        console.log(
          '🚀 ~ file: post-sensor.component.ts:49 ~ PostSensorComponent ~ this.postService.getPostsHistory ~  this.dataSource:',
          this.dataSource
        );
        this.totalPages = res.pagination.total;
      },
      (errMsg) => {
        this.isLoading = false;
      }
    );
  }

  seePost(post: any) {
    console.log('Seeing post detail....');
    const dialogRef = this.dialog.open(PostSensorDialogComponent, {
      width: '1000px',
      data: post,
    });

    let sub = dialogRef.componentInstance.sensorResult.subscribe((postId) => {
      if (this.dataSource) {
        this.dataSource = this.dataSource.filter(
          (post: PostItem) => post._id !== postId
        );
      }
    });
    sub = dialogRef.componentInstance.denySensorResult.subscribe((postId) => {
      if (this.dataSource) {
        this.dataSource = this.dataSource.filter(
          (post: PostItem) => post._id !== postId
        );
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
    });
  }

  changeCurrentPage(position: number) {
    this.historyPosts = [];
    this.currentPage = this.paginationService.caculateCurrentPage(position);
    this.postService
      .getPostInspector(1, this.currentPage, 5)
      .subscribe((res) => {
        if (res.data) {
          this.dataSource = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.dataSource = [];
        }
      });
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
}
