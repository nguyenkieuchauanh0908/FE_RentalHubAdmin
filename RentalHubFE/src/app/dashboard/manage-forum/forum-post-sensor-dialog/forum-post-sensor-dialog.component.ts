import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subject, takeUntil } from 'rxjs';
import { ForumService } from '../forum.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-forum-post-sensor-dialog',
  templateUrl: './forum-post-sensor-dialog.component.html',
  styleUrls: ['./forum-post-sensor-dialog.component.scss'],
})
export class ForumPostSensorDialogComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  @ViewChild('socialContentToDisplay') socialContentToDisplay:
    | ElementRef
    | undefined;
  @Output() postLocked: EventEmitter<any> = new EventEmitter();
  postHtmlContent!: string;
  btnElement!: HTMLElement | null;

  title: string = '';
  isLoading: boolean = false;
  $destroy: Subject<boolean> = new Subject();
  error: string = '';
  post: any | null = null;
  seeMore: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private forumService: ForumService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.post = data;
    console.log('🚀 ~ ForumPostSensorDialogComponent ~ data:', data);
  }
  ngAfterViewInit(): void {
    this.socialContentToDisplay!.nativeElement.innerHTML = this.post._content;
  }
  ngOnInit(): void {
    //Initite postEdit form value
    if (this.post) {
      this.title = 'Nội dung bài viết';
    } else {
      this.title = 'Tạo bài viết';
    }
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  seeMoreContentClick() {
    this.seeMore = !this.seeMore;
  }

  unlockPost() {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận mở khóa?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.isLoading = true;
      this.forumService
        .unlockReportedPost(this.post._id)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.dialog.closeAll();
            this.notifierService.notify(
              'success',
              'Mở khóa bài viết thành công!'
            );
          }
        });
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
    this.isLoading = false;
  }

  lockPost(status: number) {
    window.scrollTo(0, 0); // Scrolls the page to the top
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận khóa?',
    });
    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.isLoading = true;
      this.forumService.lockReportedPost(this.post._id, status).subscribe(
        (res) => {
          if (res.data) {
            this.isLoading = false;
            this.postLocked.emit(this.data._id);
            this.notifierService.hideAll();
            this.dialog.closeAll();
            this.notifierService.notify(
              'success',
              'Duyệt bài viết thành công!'
            );
          }
        },
        (errMsg) => {
          this.isLoading = false;
        }
      );
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
