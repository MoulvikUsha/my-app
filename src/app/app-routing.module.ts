import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstTableComponent } from './first-table/first-table.component';
import { D3TreeComponent } from './d3-tree/d3-tree.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'first',
    component: FirstTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'd3-tree',
    component: D3TreeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
