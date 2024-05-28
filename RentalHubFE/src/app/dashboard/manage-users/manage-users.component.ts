import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {
  ROW_INSPECTOR,
  ExportExcelService,
  ROW_USERS,
} from 'src/app/shared/export-excel/export-excel.service';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { UpdateEmployeeLoginDetailDialogComponent } from '../update-employee-login-detail-dialog/update-employee-login-detail-dialog.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent {
  isLoading = false;
  $destroy: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = ['id', 'image', 'name', 'email', 'status'];
  dataSource!: any[];
  // myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  sourceTags: Set<Tags> = new Set();

  dataForExcel: ROW_USERS[] = [];

  inspectorData!: ROW_USERS[];

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private notifierService: NotifierService,
    public exportService: ExportExcelService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.currentPage = 1;
    // if (this.currentUid) {
    //   this.myProfile = this.accountService.getProfile(this.currentUid);
    // }
    this.accountService.getAllUsers(this.currentPage, 5).subscribe(
      (res) => {
        this.dataSource = res.data;
        this.totalPages = res.pagination.total;
        this.isLoading = false;
      },
      (errMsg) => {
        this.isLoading = false;
      }
    );
    this.exportService.getUsersData().subscribe((res) => {
      if (res.data) {
        this.inspectorData = res.data;
      }
    });
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
    this.accountService.getAllUsers(this.currentPage, 5).subscribe(
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
    this.accountService
      .findUserByEmailOrId(form.keyword)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          if (res.data) {
            this.isLoading = false;
            this.dataSource = [];
            this.currentPage = 1;
            this.totalPages = 1;
            this.dataSource.push(res.data);
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

  reloadData() {
    this.isLoading = true;
    this.currentPage = 1;
    this.accountService.getAllUsers(this.currentPage, 5).subscribe(
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
  export() {
    if (this.inspectorData) {
      this.inspectorData.forEach((row: ROW_USERS) => {
        this.dataForExcel.push(row);
      });

      let reportData = {
        title: 'User Report',
        data: this.dataForExcel,
        headers: Object.keys(this.inspectorData[0]),
        sheetTitle: 'User',
        footerRow: "User's list until",
      };

      this.exportService.exportExcel(reportData);
    }
  }
}
