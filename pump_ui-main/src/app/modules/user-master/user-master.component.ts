import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'app/services/notification.service';
import { UserServiceService } from 'app/services/user-service.service';
import { API_USER_LIST } from 'app/serviceult';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {

  userList: any = [];
  tableData: any[] = [];
  searchTerm: string = '';
  compD: any;
  dataSource: any[] | undefined;
  currentPage = 1;
  itemsPerPage = 4;
  userId: string;

  constructor(
    private http: HttpClient,
    private use: UserServiceService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.getdata();
  }

  getdata() {
    this.userId = localStorage.getItem('userId');
    const params = { userId: this.userId };
    this.http.get(API_USER_LIST, { params }).subscribe((data) => {
      this.userList = data;
    });
  }


  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '50%',
      height: '60%',
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.userList.filter = filterValue;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  editUser(selectedUser: any) {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '50%',
      height: '60%',
      data: selectedUser
    });

    // Subscribe to the afterClosed event to handle any actions after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }

  deleteUser(id) {
     this.use.deleteUser(id).subscribe((result) => {
      this.userList = result;
      this.notificationService.success('User deleted successfully');
      this.getdata();
    });
  }

}
