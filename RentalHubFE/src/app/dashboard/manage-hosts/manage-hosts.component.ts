import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostService } from 'src/app/posts/post.service';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { HostService } from './host.service';
import { HostSensorDialogComponent } from './host-sensor-dialog/host-sensor-dialog.component';
import { Hosts } from './host.model';
import {
  ExportExcelService,
  ROW_HOST,
} from 'src/app/shared/export-excel/export-excel.service';
import { Utils } from 'src/app/shared/utils';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-manage-hosts',
  templateUrl: './manage-hosts.component.html',
  styleUrls: ['./manage-hosts.component.scss'],
})
export class ManageHostsComponent implements OnInit, OnDestroy {
  isLoading = false;
  $destroy: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = [
    'uId',
    'name',
    'dob',
    'home',
    'address',
    'date',
  ];
  dataSource!: any[] | null;
  myProfile!: User | null;
  currentUid!: string | null;
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  currentHostReqStatus: number = 0;
  dataForExcel: ROW_HOST[] = [];

  inspectorData!: ROW_HOST[];

  constructor(
    private accountService: AccountService,
    public exportService: ExportExcelService,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private hostService: HostService,
    private notifierService: NotifierService
  ) {
    this.isLoading = true;
    this.currentPage = 1;
    this.currentHostReqStatus = 0;
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
    this.hostService
      .getActiveHostByRequests(this.currentHostReqStatus, this.currentPage, 5)
      .subscribe(
        (res) => {
          if (res.data) {
            this.dataSource = res.data;
            this.totalPages = res.pagination.total;
          }

          this.isLoading = false;
        },
        (errMsg) => {
          this.isLoading = false;
        }
      );
    this.exportService.getHostData().subscribe((res) => {
      if (res.data) {
        this.inspectorData = res.data;
      }
    });
  }
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  ngOnInit(): void {}

  //Xem chi tiết hồ sơ đăng ký host
  seeDetail(host: any) {
    console.log('Seeing host IDCard detail....', host);
    const dialogRef = this.dialog.open(HostSensorDialogComponent, {
      width: '500px',
      data: { hostId: host._uId, requestStatus: this.currentHostReqStatus },
    });
    //Lọc hồ sơ sau khi kiểm duyệt xong
    let sub = dialogRef.componentInstance.sensorResult.subscribe((identId) => {
      if (this.dataSource) {
        this.dataSource = this.dataSource.filter(
          (host: Hosts) => host._id !== identId
        );
      }
    });
    sub = dialogRef.componentInstance.denySensorResult.subscribe((identId) => {
      if (this.dataSource) {
        this.dataSource = this.dataSource.filter(
          (host: Hosts) => host._id !== identId
        );
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      sub.unsubscribe();
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
    this.hostService
      .getActiveHostByRequests(this.currentHostReqStatus, this.currentPage, 5)
      .subscribe(
        (res) => {
          if (res.data) {
            this.dataSource = res.data;
            this.totalPages = res.pagination.total;
          }

          this.isLoading = false;
        },
        (errMsg) => {
          this.isLoading = false;
        }
      );
  }

  changeStatusOfHosts(type: string): void {
    switch (type) {
      case 'Waiting':
        console.log('Change status of hosts to Waiting....');

        this.currentHostReqStatus = 0;
        //Call API
        break;
      case 'Sensored':
        //Call API
        console.log('Change status of hosts to Sensored....');
        this.currentHostReqStatus = 1;
        break;
      case 'Denied':
        //Call API
        console.log('Change status of hosts to Denied....');
        this.currentHostReqStatus = 2;
        break;
      default:
    }
    this.currentPage = 1;
    this.dataSource = null;
    // console.log(
    //   '🚀 ~ ManageHostsComponent ~ changeStatusOfHosts ~ this.dataSource:',
    //   this.dataSource
    // );
    this.hostService
      .getActiveHostByRequests(
        this.currentHostReqStatus,
        this.currentPage,
        this.pageItemLimit
      )
      .subscribe(
        (res) => {
          if (res.data) {
            this.dataSource = res.data;
            this.totalPages = res.pagination.total;
          }

          this.isLoading = false;
        },
        (errMsg) => {
          this.isLoading = false;
        }
      );
  }

  export() {
    if (this.inspectorData) {
      this.inspectorData.forEach((row: ROW_HOST) => {
        this.dataForExcel.push(row);
      });

      let reportData = {
        title: 'Host Report',
        data: this.dataForExcel,
        headers: Object.keys(this.inspectorData[0]),
        sheetTitle: 'Host',
        footerRow: "Host's list until",
      };
      this.exportService.exportExcel(reportData);
    }
  }

  reloadData() {
    this.isLoading = true;
    this.currentPage = 1;
    this.hostService
      .getActiveHostByRequests(
        this.currentHostReqStatus,
        this.currentPage,
        this.pageItemLimit
      )
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
    let sensor: boolean = false;
    if (this.currentHostReqStatus === 1) {
      sensor = true;
    }
    this.hostService
      .findHostByIdentId(form.keyword, sensor)
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
}
