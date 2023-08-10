import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePopupComponent } from '../update-popup/update-popup.component';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent implements OnInit {

  usersList: any;
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  constructor(public authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(res => {
      this.usersList = res;
      this.dataSource = new MatTableDataSource(this.usersList);
      this.dataSource.paginator = this.paginator;
    })
  }

  updateUser(id: any) {
    const popup = this.dialog.open(UpdatePopupComponent, {
      // data: {
      //   usercode: id,
      // }
    });

    popup.afterClosed().subscribe(res => {
      this.loadUsers();
    })
  }
}
