import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { ManagePostSensorComponent } from './manage-post-sensor/manage-post-sensor.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PostSensorDialogComponent } from './manage-post-sensor/post-sensor-dialog/post-sensor-dialog.component';
import { ManageCheckedPostsComponent } from './manage-checked-posts/manage-checked-posts.component';
import { ManageDeniedPostsComponent } from './manage-denied-posts/manage-denied-posts.component';
import { AccountEditDialogComponent } from './account-edit-dialog/account-edit-dialog.component';
import { UpdateAvatarDialogComponent } from './update-avatar-dialog/update-avatar-dialog.component';
import { LoginDetailUpdateDialogComponent } from './login-detail-update-dialog/login-detail-update-dialog.component';
import { ManageReportedPostsComponent } from './manage-reported-posts/manage-reported-posts.component';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { UpdateEmployeeLoginDetailDialogComponent } from './update-employee-login-detail-dialog/update-employee-login-detail-dialog.component';
import { AddNewEmployeeDialogComponent } from './manage-employees/add-new-employee-dialog/add-new-employee-dialog.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TotalDataComponent } from './statistics/total-data/total-data.component';
import { ManageHostsComponent } from './manage-hosts/manage-hosts.component';
import { HostSensorDialogComponent } from './manage-hosts/host-sensor-dialog/host-sensor-dialog.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { AddressSensorDialogComponent } from './manage-addresses/address-sensor-dialog/address-sensor-dialog.component';
import { UsersStatisticsComponent } from './statistics/users-statistics/users-statistics.component';
import { PostsStatisticsComponent } from './statistics/posts-statistics/posts-statistics.component';
import { HostsStatisticsComponent } from './statistics/hosts-statistics/hosts-statistics.component';
import { EmployeesStatisticsComponent } from './statistics/employees-statistics/employees-statistics.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageForumComponent } from './manage-forum/manage-forum.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManagePostSensorComponent,
    PostSensorDialogComponent,
    ManageCheckedPostsComponent,
    ManageDeniedPostsComponent,
    AccountEditDialogComponent,
    UpdateAvatarDialogComponent,
    LoginDetailUpdateDialogComponent,
    ManageReportedPostsComponent,
    ManageEmployeesComponent,
    UpdateEmployeeLoginDetailDialogComponent,
    AddNewEmployeeDialogComponent,
    StatisticsComponent,
    ManageHostsComponent,
    HostSensorDialogComponent,
    ManageAddressesComponent,
    AddressSensorDialogComponent,
    UsersStatisticsComponent,
    PostsStatisticsComponent,
    HostsStatisticsComponent,
    EmployeesStatisticsComponent,
    ManageUsersComponent,
    ManageForumComponent,
  ],
  imports: [CommonModule, FormsModule, DashboardRoutingModule, SharedModule],
  providers: [],
})
export class DashBoardModule {}
