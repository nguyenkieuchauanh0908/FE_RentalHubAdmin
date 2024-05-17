import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePostSensorComponent } from './manage-post-sensor/manage-post-sensor.component';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { ManageCheckedPostsComponent } from './manage-checked-posts/manage-checked-posts.component';
import { ManageDeniedPostsComponent } from './manage-denied-posts/manage-denied-posts.component';
import { ManageReportedPostsComponent } from './manage-reported-posts/manage-reported-posts.component';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ManageHostsComponent } from './manage-hosts/manage-hosts.component';
import { ManageAddressesComponent } from './manage-addresses/manage-addresses.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'post-sensor',
        component: ManagePostSensorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'checked-posts',
        component: ManageCheckedPostsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'denied-posts',
        component: ManageDeniedPostsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reported-posts',
        component: ManageReportedPostsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-employees',
        component: ManageEmployeesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-hosts',
        component: ManageHostsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-addresses',
        component: ManageAddressesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
