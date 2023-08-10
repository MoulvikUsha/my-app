import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstTableComponent } from './first-table/first-table.component';
import { D3TreeComponent } from './d3-tree/d3-tree.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuardGuard } from './guards/role-guard.guard';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserListingComponent } from './user-listing/user-listing.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: 'first',
    component: FirstTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'd3-tree',
    component: D3TreeComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: ['Admin', 'Editor', 'Manager']
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserListingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
