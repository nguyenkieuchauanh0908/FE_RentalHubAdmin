import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'forget-password/:uId/:token',
    component: ForgetPasswordComponent,
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashBoardModule),
  },

  {
    path: '',
    redirectTo: '/dashboard/statistics',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
