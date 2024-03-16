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

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog,
    private paginationService: PaginationService,
    private notifierService: NotifierService
  ) {
    if (this.currentUid) {
      this.myProfile = this.accountService.getProfile(this.currentUid);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.paginationService.currentPage = 1;
    this.accountService.getAllInspectors(1, 5).subscribe(
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

  seeEmployeeDetails(employeeDetails: any) {
    if (employeeDetails._active === true) {
      const dialogRef = this.dialog.open(
        UpdateEmployeeLoginDetailDialogComponent,
        {
          width: '1000px',
          data: employeeDetails,
        }
      );
    } else {
      this.notifierService.notify('warning', 'Tài khoản này đã bị khóa!');
    }
  }

  changeCurrentPage(position: number) {
    this.historyPosts = [];
    this.currentPage = this.paginationService.caculateCurrentPage(position);
    this.accountService
      .getAllInspectors(this.currentPage, 5)
      .subscribe((res) => {
        if (res) {
          this.dataSource = res.data;
          this.totalPages = res.pagination.total;
        } else {
          this.dataSource = [];
        }
      });
  }

  blockInspector(inspectId: string) {
    this.accountService.blockInspectorById(inspectId).subscribe((res) => {
      if (res) {
        this.dataSource.map((employee) =>
          employee._id === inspectId ? (employee._active = false) : ''
        );
        console.log(
          '🚀 ~ ManageEmployeesComponent ~ this.accountService.unBlockInspectorById ~ this.dataSource:',
          this.dataSource
        );
        this;
        this.notifierService.notify(
          'success',
          'Khóa tài khoản nhân viên thành công!'
        );
      }
    });
  }

  UnblockInspector(inspectId: string) {
    this.accountService.blockInspectorById(inspectId).subscribe((res) => {
      if (res) {
        this.dataSource.forEach((employee) =>
          employee._id === inspectId ? (employee._active = true) : ''
        );
        console.log(
          '🚀 ~ ManageEmployeesComponent ~ this.accountService.unBlockInspectorById ~ this.dataSource:',
          this.dataSource
        );
        this.notifierService.notify(
          'success',
          'Mở tài khoản nhân viên thành công!'
        );
      }
    });
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
