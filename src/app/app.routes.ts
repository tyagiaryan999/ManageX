import { Routes } from '@angular/router';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';

import { HomeSectionComponent } from './home-section/home-section.component';
import { RegistrationOtpComponent } from './registration-otp/registration-otp.component';
import { DasboardOGComponent } from './dasboard-og/dasboard-og.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { authGuard } from './auth/auth.guard';
export const routes: Routes = [
  { path: '', component: UserLoginComponent },
  {
    path: 'home',
    canActivate: [authGuard],
    component: DashboardLayoutComponent,
  },
  // { path: 'homepage/dashboard', component: DashboardComponent },
  {
    path: 'home',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'home', component: HomeSectionComponent },
      { path: 'dashOG', component: DasboardOGComponent },
      { path: 'mytask', component: MyTaskComponent },
      {
        path: 'tasklist',
        loadChildren: () =>
          import('./task/task.module').then((m) => m.TaskModule),
      },
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'registration',
    component: UserdetailsComponent,
  },
  {
    path: 'registrationOtp',
    component: RegistrationOtpComponent,
  },

  { path: '**', redirectTo: '' },
];
