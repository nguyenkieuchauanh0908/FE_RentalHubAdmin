import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { PostItem } from 'src/app/posts/posts-list/post-item/post-item.model';
import { PaginationService } from 'src/app/shared/pagination/pagination.service';
import { Tags } from 'src/app/shared/tags/tag.model';
import { UpdateEmployeeLoginDetailDialogComponent } from '../update-employee-login-detail-dialog/update-employee-login-detail-dialog.component';
import { NotifierService } from 'angular-notifier';
import { AddNewEmployeeDialogComponent } from './add-new-employee-dialog/add-new-employee-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import {
  ExportExcelService,
  ROW_ITEM,
} from 'src/app/shared/export-excel/export-excel.service';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.scss'],
})
export class ManageEmployeesComponent {
  isLoading = false;
  displayedColumns: string[] = ['id', 'image', 'name', 'email', 'actions'];
  dataSource!: any[];
  myProfile!: User | null;
  currentUid!: string | null;
  historyPosts: PostItem[] = new Array<PostItem>();
  totalPages: number = 1;
  currentPage: number = 1;
  pageItemLimit: number = 5;
  myProfileSub = new Subscription();
  getTagSub = new Subscription();
  sourceTags: Set<Tags> = new Set();

  dataForExcel: ROW_ITEM[] = [];

  empPerformance = [
    {
      ID: 10011,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Jan',
      YEAR: 2022,
      SALES: 132412,
      CHANGE: 12,
      LEADS: 35,
    },
    {
      ID: 10012,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Feb',
      YEAR: 2022,
      SALES: 232324,
      CHANGE: 2,
      LEADS: 443,
    },
    {
      ID: 10013,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Mar',
      YEAR: 2022,
      SALES: 542234,
      CHANGE: 45,
      LEADS: 345,
    },
    {
      ID: 10014,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Apr',
      YEAR: 2022,
      SALES: 223335,
      CHANGE: 32,
      LEADS: 234,
    },
    {
      ID: 10015,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'May',
      YEAR: 2022,
      SALES: 455535,
      CHANGE: 21,
      LEADS: 12,
    },
  ];

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private notifierService: NotifierService,
    public ete: ExportExcelService
  ) {
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.accountService.getAllInspectors(this.currentPage, 5).subscribe(
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

  seeEmployeeDetails(employeeDetails: any) {
    if (employeeDetails._active === true) {
      const dialogRef = this.dialog.open(
        UpdateEmployeeLoginDetailDialogComponent,
        {
          width: '400px',
          data: employeeDetails,
        }
      );
    } else {
      this.notifierService.notify('warning', 'Tài khoản này đã bị khóa!');
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
    this.accountService.getAllInspectors(this.currentPage, 5).subscribe(
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

  blockInspector(inspectId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận khóa cho tài khoản này?',
    });

    const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
      this.accountService.blockInspectorById(inspectId).subscribe((res) => {
        if (res) {
          this.dataSource.map((employee) =>
            employee._id === inspectId ? (employee._active = false) : ''
          );

          this.notifierService.notify(
            'success',
            'Khóa tài khoản nhân viên thành công!'
          );
        }
      });
    });
  }

  UnblockInspector(inspectId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Xác nhận mở khóa cho tài khoản này?',
    });

    const sub = dialogRef.componentInstance.confirmYes.subscribe((res) => {
      this.accountService.blockInspectorById(inspectId).subscribe((res) => {
        if (res) {
          this.dataSource.forEach((employee) =>
            employee._id === inspectId ? (employee._active = true) : ''
          );
          // console.log(
          //   '🚀 ~ ManageEmployeesComponent ~ this.accountService.unBlockInspectorById ~ this.dataSource:',
          //   this.dataSource
          // );
          this.notifierService.notify(
            'success',
            'Mở tài khoản nhân viên thành công!'
          );
        }
      });
    });
  }

  export() {
    console.log('Exporting file...');
    this.empPerformance.forEach((row: ROW_ITEM) => {
      this.dataForExcel.push(row);
    });

    let reportData = {
      title: 'Employee Sales Report - Jan 2022',
      data: this.dataForExcel,
      headers: Object.keys(this.empPerformance[0]),
    };

    this.ete.exportExcel(reportData);
  }

  addNewEmployee() {
    console.log('Seeing post detail....');
    const dialogRef = this.dialog.open(AddNewEmployeeDialogComponent, {
      width: '400px',
    });

    let sub = dialogRef.componentInstance.newInspector.subscribe(
      (inspector) => {
        console.log(
          '🚀 ~ ManageEmployeesComponent ~ addNewEmployee ~ inspector:',
          inspector
        );
        if (this.dataSource) {
          this.dataSource = [...this.dataSource, inspector];
          console.log(
            '🚀 ~ ManageEmployeesComponent ~ addNewEmployee ~ this.dataSource:',
            this.dataSource
          );
        }
      }
    );
    // sub.unsubscribe();
  }
}
