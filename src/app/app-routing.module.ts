import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstTableComponent } from './first-table/first-table.component';
import { D3TreeComponent } from './d3-tree/d3-tree.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'd3-tree',
    pathMatch: 'full'
  },
  {
    path: 'first',
    component: FirstTableComponent
  },
  {
    path: 'd3-tree',
    component: D3TreeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
